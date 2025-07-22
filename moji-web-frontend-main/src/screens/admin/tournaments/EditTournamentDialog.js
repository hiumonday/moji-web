import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Paper,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTournament,
  toggleTournamentPublish,
} from "../../../redux/slices/tournamentSlice";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditTournamentDialog = ({ open, onClose, tournament }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tournament);
  const { tournaments } = useSelector((state) => state.tournament);

  const [tournamentData, setTournamentData] = useState({
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
    is_active: false,
  });

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    if (tournament) {
      const currentTournament =
        tournaments.find((t) => t._id === tournament._id) || tournament;
      setTournamentData({
        ...currentTournament,
        registrationStartDate:
          currentTournament.registrationStartDate?.split("T")[0] || "",
        registrationEndDate:
          currentTournament.registrationEndDate?.split("T")[0] || "",
        is_active: currentTournament.is_active || false,
        roles: currentTournament.roles || [],
      });

      if (currentTournament.bannerUrl) {
        setBannerPreview(currentTournament.bannerUrl);
      } else {
        setBannerPreview(null);
      }
    }
  }, [tournament, tournaments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.keys(tournamentData).forEach((key) => {
        if (key === "roles") {
          formData.append(key, JSON.stringify(tournamentData[key]));
        } else {
          formData.append(key, tournamentData[key]);
        }
      });

      if (selectedBanner) {
        formData.append("banner", selectedBanner);
      }

      await dispatch(
        updateTournament({ id: tournament._id, tournamentData: formData })
      );
      onClose();
    } catch (error) {
      console.error("Failed to update tournament:", error);
    }
  };

  const addRole = () => {
    setTournamentData({
      ...tournamentData,
      roles: [
        ...tournamentData.roles,
        { roleName: "Debater", slots: 0, price: 0 },
      ],
    });
  };

  const removeRole = (index) => {
    const newRoles = tournamentData.roles.filter((_, i) => i !== index);
    setTournamentData({ ...tournamentData, roles: newRoles });
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = tournamentData.roles.map((role, i) => {
      if (i === index) {
        return { ...role, [field]: value };
      }
      return role;
    });
    setTournamentData({ ...tournamentData, roles: newRoles });
  };

  const handlePublishToggle = async () => {
    try {
      await dispatch(toggleTournamentPublish(tournament._id)).unwrap();
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  const handleBannerSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournamentData({ ...tournamentData, [name]: value });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Tournament
        <FormControlLabel
          sx={{ float: "right" }}
          control={
            <Switch
              checked={tournamentData.is_active}
              onChange={handlePublishToggle}
              disabled={loading}
            />
          }
          label={tournamentData.is_active ? "Published" : "Draft"}
        />
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Tournament Name"
                    value={tournamentData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    label="Description"
                    value={tournamentData.description}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Configuration */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    name="type"
                    label="Type"
                    value={tournamentData.type}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="BP">BP</MenuItem>
                    <MenuItem value="WSDC">WSDC</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    name="platform"
                    label="Platform"
                    value={tournamentData.platform}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    name="status"
                    label="Status"
                    value={tournamentData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                    <MenuItem value="registration_open">
                      Registration Open
                    </MenuItem>
                    <MenuItem value="registration_closed">
                      Registration Closed
                    </MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Registration Period & URL */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Registration
                </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Start Date"
                                type="date"
                                value={tournamentData.registrationStartDate}
                                onChange={(e) =>
                                    setTournamentData({
                                        ...tournamentData,
                                        registrationStartDate: e.target.value,
                                    })
                                }
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="End Date"
                                type="date"
                                value={tournamentData.registrationEndDate}
                                onChange={(e) =>
                                    setTournamentData({
                                        ...tournamentData,
                                        registrationEndDate: e.target.value,
                                    })
                                }
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="discordLink"
                                label="Discord Link"
                                value={tournamentData.discordLink || ""}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="fanpageLink"
                                label="Fanpage Link"
                                value={tournamentData.fanpageLink || ""}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
            </Grid>

            {/* Roles & Pricing */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Roles & Pricing</Typography>
                <IconButton color="primary" onClick={addRole} disabled={loading}>
                  <AddIcon />
                </IconButton>
              </Box>

              {tournamentData.roles.map((role, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      color="error"
                      onClick={() => removeRole(index)}
                    >
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
            </Grid>
            
            {/* Banner */}
            <Grid item xs={12}>
              <Box>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Update Banner
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleBannerSelect}
                  />
                </Button>
                {bannerPreview && (
                  <Box
                    sx={{
                      mt: 2,
                      width: "100%",
                      maxHeight: "300px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTournamentDialog; 