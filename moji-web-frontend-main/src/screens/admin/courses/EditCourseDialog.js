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
  updateCourseAction,
  toggleCoursePublish,
} from "../../../redux/actions/courseActions";
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

const EditCourseDialog = ({ open, onClose, course }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.course);
  const { courses } = useSelector((state) => state.course);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    earlyBirdPrice: "",
    bundlePrice: "",
    alumniPrice: "",
    classes: [],
    learning_platform: {
      access_code: "",
      access_link: "",
    },
    is_active: false,
    type: "non_contact_based",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (course) {
      const currentCourse = courses.find((c) => c._id === course._id) || course;
      setCourseData({
        ...currentCourse,
        price: currentCourse.price?.toString() || "0",
        earlyBirdPrice: currentCourse.earlyBirdPrice?.toString() || "0",
        bundlePrice: currentCourse.bundlePrice?.toString() || "0",
        alumniPrice: currentCourse.alumniPrice?.toString() || "0",
        is_active: currentCourse.is_active || false,
        learning_platform: currentCourse.learning_platform || {
          access_code: "",
          access_link: "",
        },
        classes: currentCourse.classes || [],
        discounts: currentCourse.discounts || [],
      });

      if (currentCourse.image?.data) {
        setImagePreview(
          `data:${currentCourse.image.contentType};base64,${currentCourse.image.data}`
        );
      }
    }
  }, [course, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);
      formData.append("earlyBirdPrice", courseData.earlyBirdPrice);
      formData.append("bundlePrice", courseData.bundlePrice);
      formData.append("alumniPrice", courseData.alumniPrice);
      formData.append("is_active", courseData.is_active);
      formData.append("type", courseData.type);

      formData.append("classes", JSON.stringify(courseData.classes));
      formData.append("discounts", JSON.stringify(courseData.discounts));
      formData.append(
        "learning_platform",
        JSON.stringify(courseData.learning_platform)
      );

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await dispatch(updateCourseAction(course._id, formData));
      onClose();
    } catch (error) {
      console.error("Failed to update course:", error);
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
          earlyBirdSlot: "0",
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

  const handlePublishToggle = async () => {
    try {
      const newIsActive = !courseData.is_active;

      setCourseData((prev) => ({
        ...prev,
        is_active: newIsActive,
      }));

      const updatedCourse = await dispatch(
        toggleCoursePublish(course._id)
      ).unwrap();

      if (updatedCourse) {
        setCourseData((prev) => ({
          ...prev,
          ...updatedCourse,
          price: updatedCourse.price.toString(),
          earlyBirdPrice: updatedCourse.earlyBirdPrice.toString(),
          bundlePrice: updatedCourse.bundlePrice.toString(),
          alumniPrice: updatedCourse.alumniPrice.toString(),
        }));
      }
    } catch (error) {
      setCourseData((prev) => ({
        ...prev,
        is_active: !prev.is_active,
      }));
      console.error("Failed to toggle publish status:", error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {courseData.is_active ? "Edit Published Course" : "Edit Draft Course"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Course Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Course Type"
                    value={courseData.type}
                    onChange={(e) =>
                      setCourseData({ ...courseData, type: e.target.value })
                    }
                    disabled={isLoading}
                  >
                    <MenuItem value="non_contact_based">
                      Non Contact Based
                    </MenuItem>
                    <MenuItem value="contact_based">Contact Based</MenuItem>
                  </TextField>
                </Grid>
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
                  {courseData.type === "non_contact_based" && (
                    <>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        label="Price"
                        value={courseData.price}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            price: e.target.value,
                          })
                        }
                        disabled={isLoading}
                      />
                    </>
                  )}
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
              </Grid>
            </Grid>

            {courseData.type === "non_contact_based" && (
              <>
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
              </>
            )}

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
                    {courseData.type === "non_contact_based" && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          type="number"
                          label="Early Bird Slots"
                          value={classItem.earlyBirdSlot || "0"}
                          onChange={(e) =>
                            handleClassChange(
                              index,
                              "earlyBirdSlot",
                              e.target.value
                            )
                          }
                          disabled={isLoading}
                          helperText="Number of early bird slots for this class"
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Update Course Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </Button>
                {imagePreview && (
                  <Box
                    sx={{
                      mt: 2,
                      width: "340px",
                      height: "140px",
                      overflow: "hidden",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
            color={courseData.is_active ? "success" : "primary"}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : courseData.is_active ? (
              "Save & Publish"
            ) : (
              "Save as Draft"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCourseDialog;
