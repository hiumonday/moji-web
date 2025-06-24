import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  CardMedia,
  CardActions,
  ButtonGroup,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  deleteCourse,
  updateCourseAction,
  toggleCoursePublish,
} from "../../../redux/actions/courseActions";
import EditCourseDialog from "./EditCourseDialog";
import { useNavigate } from "react-router-dom";

const CourseCard = React.memo(({ course, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const toggleLoading = useSelector(
    (state) => state.course.toggleLoading[course._id]
  );

  const handleToggle = () => {
    dispatch(toggleCoursePublish(course._id));
  };

  const getImageUrl = () => {
    if (course.image?.data) {
      // The data should already be in base64 format from the backend
      return `data:${course.image.contentType};base64,${course.image.data}`;
    }
    return "https://via.placeholder.com/300x140"; // Fallback image
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
          alt={course.title}
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
        label={course.is_active ? "Active" : "Inactive"}
        color={course.is_active ? "success" : "default"}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: course.is_active
            ? "rgba(46, 125, 50, 0.9)"
            : "rgba(97, 97, 97, 0.9)",
          color: "white",
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {course.title}
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
          {course.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${course.price}
          </Typography>
          {course.earlyBirdPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              ${course.earlyBirdPrice}
            </Typography>
          )}
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
              checked={course.is_active}
              onChange={handleToggle}
              disabled={toggleLoading}
            />
          }
          label={course.is_active ? "Published" : "Draft"}
        />
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(course)}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(course._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
});

const MyCourses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector((state) => state.course);
  const [editCourse, setEditCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleDelete = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(courseId));
    }
  };

  const handleEditClick = (course) => {
    setEditCourse(course);
  };

  const handleCreateClick = () => {
    navigate("/admin/courses/create");
  };

  const sortedCourses = React.useMemo(() => {
    return [...courses].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [courses]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          Course Management
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {sortedCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <CourseCard
              course={course}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {courses.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No courses available
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClick}
            sx={{ mt: 2 }}
          >
            Create Your First Course
          </Button>
        </Box>
      )}

      <EditCourseDialog
        open={Boolean(editCourse)}
        onClose={() => setEditCourse(null)}
        course={editCourse}
      />
    </Box>
  );
};

export default MyCourses;
