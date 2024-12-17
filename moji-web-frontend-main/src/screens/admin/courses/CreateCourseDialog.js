import React, { useState } from "react";
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
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createCourse } from "../../../redux/actions/courseActions";

const CreateCourseDialog = ({ open, onClose, initialPublishState }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.course);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    earlyBirdPrice: "",
    earlyBirdSlot: "5",
    is_active: initialPublishState,
    classes: [
      {
        level: "",
        language: "",
        teacherName: "",
        day: "",
        startTime: "",
        endTime: "",
        location: "",
      },
    ],
    learning_platform: {
      access_code: "",
      access_link: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCourse(courseData));
      onClose();
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const addClass = () => {
    setCourseData({
      ...courseData,
      classes: [
        ...courseData.classes,
        {
          level: "",
          language: "",
          teacherName: "",
          day: "",
          startTime: "",
          endTime: "",
          location: "",
        },
      ],
    });
  };

  const removeClass = (index) => {
    const newClasses = courseData.classes.filter((_, i) => i !== index);
    setCourseData({ ...courseData, classes: newClasses });
  };

  const handleClassChange = (index, field, value) => {
    const newClasses = courseData.classes.map((classItem, i) => {
      if (i === index) {
        return { ...classItem, [field]: value };
      }
      return classItem;
    });
    setCourseData({ ...courseData, classes: newClasses });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {courseData.is_active
          ? "Create & Publish Course"
          : "Create Course Draft"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Course Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Course Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Course Title"
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData({ ...courseData, title: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Price"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData({ ...courseData, price: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Early Bird Price"
                    value={courseData.earlyBirdPrice}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        earlyBirdPrice: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Early Bird Slots"
                    value={courseData.earlyBirdSlot}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        earlyBirdSlot: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        description: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={courseData.is_active}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              is_active: e.target.checked,
                            })
                          }
                          disabled={isLoading}
                        />
                      }
                      label={courseData.is_active ? "Published" : "Draft"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Learning Platform */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Learning Platform
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Access Code"
                    value={courseData.learning_platform.access_code}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        learning_platform: {
                          ...courseData.learning_platform,
                          access_code: e.target.value,
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Access Link"
                    value={courseData.learning_platform.access_link}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        learning_platform: {
                          ...courseData.learning_platform,
                          access_link: e.target.value,
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Classes */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Classes</Typography>
                <IconButton
                  color="primary"
                  onClick={addClass}
                  disabled={isLoading}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {courseData.classes.map((classItem, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      color="error"
                      onClick={() => removeClass(index)}
                      disabled={courseData.classes.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Level"
                        value={classItem.level}
                        onChange={(e) =>
                          handleClassChange(index, "level", e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Language"
                        value={classItem.language}
                        onChange={(e) =>
                          handleClassChange(index, "language", e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Teacher Name"
                        value={classItem.teacherName}
                        onChange={(e) =>
                          handleClassChange(
                            index,
                            "teacherName",
                            e.target.value
                          )
                        }
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Day"
                        value={classItem.day}
                        onChange={(e) =>
                          handleClassChange(index, "day", e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        required
                        fullWidth
                        type="time"
                        label="Start Time"
                        value={classItem.startTime}
                        onChange={(e) =>
                          handleClassChange(index, "startTime", e.target.value)
                        }
                        disabled={isLoading}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        required
                        fullWidth
                        type="time"
                        label="End Time"
                        value={classItem.endTime}
                        onChange={(e) =>
                          handleClassChange(index, "endTime", e.target.value)
                        }
                        disabled={isLoading}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={classItem.location}
                        onChange={(e) =>
                          handleClassChange(index, "location", e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Create Course"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCourseDialog;
