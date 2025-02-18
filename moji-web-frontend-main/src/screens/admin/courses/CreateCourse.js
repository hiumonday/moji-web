import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  ButtonGroup,
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
import { createCourse } from "../../../redux/actions/courseActions";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  padding: "24px",
  marginBottom: "24px",
}));

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

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: 600,
  padding: "8px 16px",
  textTransform: "none",
  "&.MuiButton-contained": {
    backgroundColor: "#2A5FFF",
    "&:hover": {
      backgroundColor: "#234FDB",
    },
    "&.Mui-disabled": {
      backgroundColor: "#E0E0E0",
      color: "#A3A3A3",
    },
  },
  "&.MuiButton-text": {
    color: "#2A5FFF",
    "&:hover": {
      color: "#234FDB",
      backgroundColor: "transparent",
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 600,
  color: "#1E1E1E",
  marginBottom: "16px",
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  color: "#1E1E1E",
  marginBottom: "12px",
}));

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

const CreateCourse = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.course);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    earlyBirdPrice: "",
    bundlePrice: "",
    alumniPrice: "",
    is_active: false,
    discounts: [],
    classes: [
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
    learning_platform: {
      access_code: "",
      access_link: "",
    },
    type: "non_contact_based",
  });

  const [discountData, setDiscountData] = useState({
    code: "",
    percentage: "",
    amount: "",
    expiresAt: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e, shouldPublish = false) => {
    e.preventDefault();
    try {
      // Basic validation for all course types
      if (!courseData.title || !courseData.type) {
        throw new Error("Title and course type are required fields");
      }

      // Additional validation for non_contact_based courses
      if (courseData.type === "non_contact_based") {
        if (!courseData.price || !courseData.earlyBirdPrice) {
          throw new Error(
            "Price and early bird price are required for non-contact based courses"
          );
        }
      }

      const formData = new FormData();

      const classesData = courseData.classes.map((classItem) => ({
        ...classItem,
        startTime: classItem.startTime || "00:00",
        endTime: classItem.endTime || "00:00",
        earlyBirdSlot:
          courseData.type === "non_contact_based"
            ? parseInt(classItem.earlyBirdSlot) || 0
            : 0,
      }));

      formData.append("title", courseData.title);
      formData.append("type", courseData.type);
      formData.append("description", courseData.description);

      // Only append price-related fields for non_contact_based courses
      if (courseData.type === "non_contact_based") {
        formData.append("price", courseData.price);
        formData.append("earlyBirdPrice", courseData.earlyBirdPrice);
        formData.append("bundlePrice", courseData.bundlePrice);
        formData.append("alumniPrice", courseData.alumniPrice);
      }

      formData.append("is_active", shouldPublish);
      formData.append("classes", JSON.stringify(classesData));
      formData.append("discounts", JSON.stringify(courseData.discounts));
      formData.append(
        "learning_platform",
        JSON.stringify(courseData.learning_platform)
      );

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await dispatch(createCourse(formData));
    } catch (error) {
      console.error("Failed to create course:", error);
      // You might want to show this error to the user through a notification system
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

  const addDiscount = () => {
    setCourseData({
      ...courseData,
      discounts: [...courseData.discounts, discountData],
    });
    setDiscountData({
      code: "",
      percentage: "",
      amount: "",
      expiresAt: "",
    });
  };

  const removeDiscount = (index) => {
    const newDiscounts = courseData.discounts.filter((_, i) => i !== index);
    setCourseData({ ...courseData, discounts: newDiscounts });
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box component="form" sx={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Basic Course Information Card */}
      <StyledPaper>
        <SectionTitle>Basic Course Information</SectionTitle>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <StyledTextField
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
              <MenuItem value="non_contact_based">Non Contact Based</MenuItem>
              <MenuItem value="contact_based">Contact Based</MenuItem>
            </StyledTextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
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

          {/* Only show pricing fields for non_contact_based courses */}
          {courseData.type === "non_contact_based" && (
            <>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  required
                  fullWidth
                  type="number"
                  label="Regular Price"
                  value={courseData.price}
                  onChange={(e) =>
                    setCourseData({ ...courseData, price: e.target.value })
                  }
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
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
                <StyledTextField
                  fullWidth
                  type="number"
                  label="Bundle Price (2+ students)"
                  value={courseData.bundlePrice}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      bundlePrice: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  helperText="Price per student when 2 or more sign up together"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  type="number"
                  label="Alumni Price"
                  value={courseData.alumniPrice}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      alumniPrice: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  helperText="Special price for returning students"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <StyledTextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={courseData.description}
              onChange={(e) =>
                setCourseData({ ...courseData, description: e.target.value })
              }
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Course Image
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Learning Platform section - only for non_contact_based courses */}
      {courseData.type === "non_contact_based" && (
        <StyledPaper>
          <SectionTitle>Learning Platform</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledTextField
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
              <StyledTextField
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
        </StyledPaper>
      )}

      {courseData.type === "non_contact_based" && (
        <>
          <StyledPaper>
            <SectionTitle>Discounts</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={3}>
                <StyledTextField
                  fullWidth
                  label="Discount Code"
                  value={discountData.code}
                  onChange={(e) =>
                    setDiscountData({ ...discountData, code: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <StyledTextField
                  fullWidth
                  type="number"
                  label="Percentage"
                  value={discountData.percentage}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      percentage: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <StyledTextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={discountData.amount}
                  onChange={(e) =>
                    setDiscountData({ ...discountData, amount: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledTextField
                  fullWidth
                  type="datetime-local"
                  label="Expires At"
                  value={discountData.expiresAt}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      expiresAt: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <StyledButton
                  variant="contained"
                  onClick={addDiscount}
                  fullWidth
                  sx={{ height: "100%" }}
                >
                  Add Discount
                </StyledButton>
              </Grid>
            </Grid>

            {courseData.discounts.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <SubTitle>Added Discounts:</SubTitle>
                <Grid container spacing={2}>
                  {courseData.discounts.map((discount, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        sx={{ p: 2, display: "flex", alignItems: "center" }}
                      >
                        <Typography sx={{ flex: 1 }}>
                          Code: {discount.code} |
                          {discount.percentage
                            ? ` ${discount.percentage}% `
                            : ""}
                          {discount.amount ? ` $${discount.amount} ` : ""}|
                          Expires:{" "}
                          {new Date(discount.expiresAt).toLocaleDateString()}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => removeDiscount(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </StyledPaper>
        </>
      )}

      <StyledPaper>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SectionTitle sx={{ mb: 0 }}>Classes</SectionTitle>
          <IconButton
            color="primary"
            onClick={addClass}
            disabled={isLoading}
            sx={{
              color: "#2A5FFF",
              "&:hover": {
                color: "#234FDB",
              },
            }}
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
                <StyledTextField
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
                <StyledTextField
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
                <StyledTextField
                  required
                  fullWidth
                  label="Teacher Name"
                  value={classItem.teacherName}
                  onChange={(e) =>
                    handleClassChange(index, "teacherName", e.target.value)
                  }
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
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
                <StyledTextField
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
                <StyledTextField
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
                <StyledTextField
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
                  <StyledTextField
                    required
                    fullWidth
                    type="number"
                    label="Early Bird Slots"
                    value={classItem.earlyBirdSlot || "0"}
                    onChange={(e) =>
                      handleClassChange(index, "earlyBirdSlot", e.target.value)
                    }
                    disabled={isLoading}
                    helperText="Number of early bird slots for this class"
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        ))}
      </StyledPaper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <ButtonGroup variant="contained">
          <Button onClick={(e) => handleSubmit(e, false)} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Save as Draft"}
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, true)}
            color="success"
            disabled={isLoading}
            sx={{
              backgroundColor: "#22C55E",
              "&:hover": {
                backgroundColor: "#16A34A",
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Create & Publish"}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default CreateCourse;
