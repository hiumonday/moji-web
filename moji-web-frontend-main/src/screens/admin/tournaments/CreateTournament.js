import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createTournament,
  fetchTournamentById,
  updateTournament,
} from "../../../redux/slices/tournamentSlice";
import BackButton from "../../../components/backButton";
import ImageUpload from "../../../components/ImageUpload";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Spinner } from "../../../components/spinner";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#D1D5DB",
    },
    "&:hover fieldset": {
      borderColor: "#D1D5DB",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2A5FFF",
      borderWidth: "2px",
      boxShadow: "0 0 5px rgba(42, 95, 255, 0.3)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6B7280",
  },
}));

const CreateTournament = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tournament: currentTournament, loading, error } = useSelector(
    (state) => state.tournament
  );

  const [tournament, setTournament] = useState({
    name: "",
    description: "",
    type: "BP",
    platform: "online",
    status: "upcoming",
    registrationStartDate: "",
    registrationEndDate: "",
    discordLink: "",
    fanpageLink: "",
    roles: [],
  });
  const [banner, setBanner] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchTournamentById(id));
    }
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && currentTournament) {
      setTournament({
        name: currentTournament.name || "",
        description: currentTournament.description || "",
        type: currentTournament.type || "BP",
        platform: currentTournament.platform || "online",
        status: currentTournament.status || "upcoming",
        registrationStartDate:
          currentTournament.registrationStartDate?.split("T")[0] || "",
        registrationEndDate:
          currentTournament.registrationEndDate?.split("T")[0] || "",
        discordLink: currentTournament.discordLink || "",
        fanpageLink: currentTournament.fanpageLink || "",
        roles: currentTournament.roles || [],
      });
      if(currentTournament.bannerUrl) {
        setBanner(currentTournament.bannerUrl);
      }
    }
  }, [isEditMode, currentTournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament({ ...tournament, [name]: value });
  };

  const handleBannerChange = (file) => {
    setBanner(file);
  };
  
  const addRole = () => {
    setTournament({
      ...tournament,
      roles: [
        ...tournament.roles,
        { roleName: "Debater", slots: 0, price: 0 },
      ],
    });
  };

  const removeRole = (index) => {
    const newRoles = tournament.roles.filter((_, i) => i !== index);
    setTournament({ ...tournament, roles: newRoles });
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = tournament.roles.map((role, i) => {
      if (i === index) {
        return { ...role, [field]: value };
      }
      return role;
    });
    setTournament({ ...tournament, roles: newRoles });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(tournament).forEach((key) => {
      if (key === "roles") {
        formData.append(key, JSON.stringify(tournament[key]));
      } else {
        formData.append(key, tournament[key]);
      }
    });

    if (banner && banner instanceof File) {
      formData.append("banner", banner);
    }

    if (isEditMode) {
      dispatch(updateTournament({ id, tournamentData: formData })).then(() => {
        navigate("/admin/tournaments");
      });
    } else {
      dispatch(createTournament(formData)).then(() => {
        navigate("/admin/tournaments");
      });
    }
  };

  if (loading && isEditMode) {
    return <Spinner />;
  }

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">
          {isEditMode ? "Edit Tournament" : "Create New Tournament"}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                label="Tournament Name"
                name="name"
                value={tournament.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={tournament.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        {/* Tournament Banner Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tournament Banner</h2>
          <ImageUpload onFileChange={handleBannerChange} currentImage={banner} />
        </div>

        {/* Configuration Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                select
                fullWidth
                label="Type"
                name="type"
                value={tournament.type}
                onChange={handleChange}
              >
                <MenuItem value="BP">BP</MenuItem>
                <MenuItem value="WSDC">WSDC</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                select
                fullWidth
                label="Platform"
                name="platform"
                value={tournament.platform}
                onChange={handleChange}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                select
                fullWidth
                label="Status"
                name="status"
                value={tournament.status}
                onChange={handleChange}
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="registration_open">Registration Open</MenuItem>
                <MenuItem value="registration_closed">
                  Registration Closed
                </MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </StyledTextField>
            </Grid>
          </Grid>
        </div>

        {/* Registration Period & URL Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Registration Period & URL
          </h2>
          <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Registration Start Date"
                  type="date"
                  name="registrationStartDate"
                  value={tournament.registrationStartDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Registration End Date"
                  type="date"
                  name="registrationEndDate"
                  value={tournament.registrationEndDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                type="url"
                label="Discord Link"
                name="discordLink"
                value={tournament.discordLink}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                type="url"
                label="Fanpage Link"
                name="fanpageLink"
                value={tournament.fanpageLink}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        {/* Roles & Pricing Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Roles & Pricing</Typography>
            <IconButton color="primary" onClick={addRole} disabled={loading}>
              <AddIcon />
            </IconButton>
          </Box>
          {tournament.roles.map((role, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton color="error" onClick={() => removeRole(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Role Name"
                    value={role.roleName}
                    onChange={(e) =>
                      handleRoleChange(index, "roleName", e.target.value)
                    }
                    disabled={loading}
                  >
                    <MenuItem value="Debater">Debater</MenuItem>
                    <MenuItem value="Adjudicator">Adjudicator</MenuItem>
                    <MenuItem value="Observer">Observer</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Slots"
                    value={role.slots}
                    onChange={(e) =>
                      handleRoleChange(index, "slots", e.target.value)
                    }
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Price"
                    value={role.price}
                    onChange={(e) =>
                      handleRoleChange(index, "price", e.target.value)
                    }
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/tournaments")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Create Tournament"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTournament; 