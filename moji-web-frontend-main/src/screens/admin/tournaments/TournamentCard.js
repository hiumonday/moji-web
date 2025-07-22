import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CardMedia,
  CardActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTournamentPublish } from "../../../redux/slices/tournamentSlice";

const TournamentCard = React.memo(({ tournament, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { toggleLoading } = useSelector((state) => state.tournament);

  const handleToggle = () => {
    dispatch(toggleTournamentPublish(tournament._id));
  };

  const getImageUrl = () => {
    if (tournament.banner?.data) {
      return `data:${tournament.banner.contentType};base64,${tournament.banner.data}`;
    }
    return "https://via.placeholder.com/300x140"; // Fallback image
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "primary";
      case "registration_open":
        return "success";
      case "registration_closed":
        return "error";
      case "ongoing":
        return "warning";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };


  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        },
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "140px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={getImageUrl()}
          alt={tournament.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/340x140";
          }}
          sx={{
            width: "340px",
            height: "140px",
            objectFit: "cover",
          }}
        />
      </Box>

      <Chip
        label={tournament.status.replace("_", " ")}
        color={getStatusColor(tournament.status)}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          backgroundColor: (theme) => theme.palette[getStatusColor(tournament.status)]?.main,
          textTransform: "capitalize",
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {tournament.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {tournament.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(tournament.registrationStartDate).toLocaleDateString('en-GB')} - {new Date(tournament.registrationEndDate).toLocaleDateString('en-GB')}
          </Typography>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={tournament.is_active}
              onChange={handleToggle}
              disabled={toggleLoading && toggleLoading[tournament._id]}
            />
          }
          label={tournament.is_active ? "Published" : "Draft"}
        />
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(tournament)}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(tournament._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
});

export default TournamentCard; 