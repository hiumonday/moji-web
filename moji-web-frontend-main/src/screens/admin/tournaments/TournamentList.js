import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournaments,
  deleteTournament,
} from "../../../redux/slices/tournamentSlice";
import { Spinner } from "../../../components/spinner";
import TournamentCard from "./TournamentCard";
import { Box, Grid, Typography, Button } from "@mui/material";
import EditTournamentDialog from "./EditTournamentDialog";

const TournamentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tournaments, loading, error } = useSelector(
    (state) => state.tournament
  );
  const [editTournament, setEditTournament] = useState(null);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      dispatch(deleteTournament(id));
    }
  };

  const handleEditClick = (tournament) => {
    setEditTournament(tournament);
  };

  const handleCreateClick = () => {
    navigate("/admin/tournaments/new");
  };
  
  const sortedTournaments = React.useMemo(() => {
    return [...tournaments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [tournaments]);

  if (loading && tournaments.length === 0) {
    return <Spinner />;
  }

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          Tournament Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateClick}
        >
          + Create Tournament
        </Button>
      </Box>

      <Grid container spacing={4}>
        {sortedTournaments.map((tournament) => (
          <Grid item xs={12} sm={6} md={4} key={tournament._id}>
            <TournamentCard
              tournament={tournament}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {tournaments.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No tournaments available
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClick}
            sx={{ mt: 2 }}
          >
            Create Your First Tournament
          </Button>
        </Box>
      )}

      {editTournament && (
        <EditTournamentDialog
          open={Boolean(editTournament)}
          onClose={() => setEditTournament(null)}
          tournament={editTournament}
        />
      )}
    </Box>
  );
};

export default TournamentList; 