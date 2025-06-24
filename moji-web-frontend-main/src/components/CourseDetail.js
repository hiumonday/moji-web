import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetail } from "../redux/actions/courseActions";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import AddToCartButton from "./AddToCartButton";
import ConsultationButton from "./ConsultationButton";

const CourseDetail = ({ i18n }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCourse: course, loading } = useSelector(
    (state) => state.course
  );
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    console.log("CourseDetail mounted with courseId:", id);
    if (id) {
      dispatch(fetchCourseDetail(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    console.log("Course data updated:", course);
    if (
      course &&
      course.classes &&
      course.classes.length > 0 &&
      !selectedClass
    ) {
      console.log("Setting initial selected class");
      setSelectedClass(course.classes[0]);
    }
  }, [course, selectedClass]);

  const handleClassChange = (classItem) => {
    setSelectedClass(classItem);
  };

  // Return loading state if course is loading or not yet loaded
  if (loading || !course) {
    console.log("Loading state - loading:", loading, "course:", course);
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Return error state if course has no classes
  if (!course.classes || course.classes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography color="error">
          {i18n.language === "en"
            ? "No classes available for this course"
            : "Không có lớp học nào cho khóa học này"}
        </Typography>
      </Box>
    );
  }

  // Don't render the main content until selectedClass is set
  if (!selectedClass) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Banner Section */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                }}
              >
                {`${course.title} - ${selectedClass.level} - ${selectedClass.language}`}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: "1.1rem",
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                {course.description}
              </Typography>
              <Box sx={{ mb: 3 }}>
                {course.classes.map((classItem) => (
                  <Chip
                    key={classItem._id}
                    label={`${classItem.level} - ${classItem.language}`}
                    onClick={() => handleClassChange(classItem)}
                    sx={{
                      mr: 1,
                      mb: 1,
                      fontSize: "0.9rem",
                      height: "32px",
                    }}
                    color={
                      selectedClass._id === classItem._id
                        ? "primary"
                        : "default"
                    }
                  />
                ))}
              </Box>
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.25rem",
                }}
              >
                {course.price ? (
                  <>
                    {course.price.toLocaleString("vi-VN")} VND
                    {course.earlyBirdPrice && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 2,
                          color: "success.main",
                          fontWeight: 600,
                        }}
                      >
                        Early Bird:{" "}
                        {course.earlyBirdPrice.toLocaleString("vi-VN")} VND
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography
                    component="span"
                    sx={{
                      color: "text.secondary",
                      fontStyle: "italic",
                    }}
                  >
                    {i18n.language === "en"
                      ? "Contact for pricing"
                      : "Liên hệ để biết thêm chi tiết"}
                  </Typography>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  width: "100%",
                  height: "240px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={course.image}
                  alt={course.title}
                  sx={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Left Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {i18n.language === "en"
                  ? "Target Audience"
                  : "Đối tượng học viên"}
              </Typography>
              <Typography paragraph>{selectedClass.target_audience}</Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {i18n.language === "en" ? "Goals" : "Mục tiêu"}
              </Typography>
              <Typography paragraph>{selectedClass.goals}</Typography>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {i18n.language === "en" ? "Syllabus" : "Nội dung chương trình"}
              </Typography>
              <List>
                {selectedClass.syllabus.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {item.content}
                          </Typography>
                          {item.duration && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {` - ${item.duration}`}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                mb: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {i18n.language === "en"
                    ? "Class Information"
                    : "Thông tin lớp học"}
                </Typography>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <PersonIcon sx={{ fontSize: "1.25rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography
                            component="span"
                            sx={{ color: "text.secondary" }}
                          >
                            {i18n.language === "en"
                              ? "Teacher: "
                              : "Giảng viên: "}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontWeight: 600, ml: 1 }}
                          >
                            {selectedClass.teacherName}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CalendarIcon sx={{ fontSize: "1.25rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography
                            component="span"
                            sx={{ color: "text.secondary" }}
                          >
                            {i18n.language === "en" ? "Day: " : "Ngày học: "}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontWeight: 600, ml: 1 }}
                          >
                            {selectedClass.day}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ScheduleIcon sx={{ fontSize: "1.25rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography
                            component="span"
                            sx={{ color: "text.secondary" }}
                          >
                            {i18n.language === "en" ? "Time: " : "Thời gian: "}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontWeight: 600, ml: 1 }}
                          >
                            {`${selectedClass.startTime} - ${selectedClass.endTime}`}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {selectedClass.learning_platform && (
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <ComputerIcon sx={{ fontSize: "1.25rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            component="span"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              component="span"
                              sx={{ color: "text.secondary" }}
                            >
                              {i18n.language === "en"
                                ? "Platform: "
                                : "Nền tảng: "}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ fontWeight: 600, ml: 1 }}
                            >
                              {selectedClass.learning_platform.platform}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                  {selectedClass.location && (
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <SchoolIcon sx={{ fontSize: "1.25rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            component="span"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              component="span"
                              sx={{ color: "text.secondary" }}
                            >
                              {i18n.language === "en"
                                ? "Location: "
                                : "Địa điểm: "}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ fontWeight: 600, ml: 1 }}
                            >
                              {selectedClass.location}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
            {course.type === "contact_based" ? (
              <ConsultationButton course={course} i18n={i18n} />
            ) : (
              <AddToCartButton
                course={course}
                selectedClass={selectedClass}
                i18n={i18n}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetail;
