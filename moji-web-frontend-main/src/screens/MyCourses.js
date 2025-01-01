import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { fetchMyCoursesAction } from '../redux/actions/myCourseAction';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MyCourses = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { enrolledCourses, isLoading, error } = useSelector((state) => state.myCourse);
  const [expandedPanels, setExpandedPanels] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyCoursesAction());
    }
  }, [dispatch, isAuthenticated]);

  const handleExpandClick = (courseId) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-medium text-gray-600">
          {t("pleaseLoginToViewProfile")}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">{t("myCourses")}</h1>
        </div>

        {/* Empty State */}
        {(!enrolledCourses?.length) ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-xl text-gray-600 mb-6">{t("noCourses")}</p>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/courses"
              sx={{ textTransform: 'none' }}
            >
              {t("browseCourses")}
            </Button>
          </div>
        ) : (
          /* Course Cards */
          enrolledCourses.map((course) => (
            <Card key={course.id} sx={{ m: 2 }}>
              <CardHeader
                title={course.courseId.title}
                subheader={
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`${t("instructor")}: ${course.courseId.instructor}`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${t("duration")}: ${course.courseId.duration}`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip label={`${t("level")}: ${course.courseId.level}`} size="small" />
                  </Box>
                }
                action={
                  <ExpandMore
                    expand={expandedPanels[course.id]}
                    onClick={() => handleExpandClick(course.id)}
                    aria-expanded={expandedPanels[course.id]}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                }
              />
              <Collapse in={expandedPanels[course.id]} timeout="auto" unmountOnExit>
                <CardContent>
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("className")}</TableCell>
                          <TableCell>{t("studentName")}</TableCell>
                          <TableCell>{t("teacher")}</TableCell>
                          <TableCell>{t("schedule")}</TableCell>
                          <TableCell>{t("platform")}</TableCell>
                          <TableCell>{t("accessDetails")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {course.participants.map((participant) => (
                          <TableRow key={`${course.id}-${participant.name}`}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {course.classId.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {t("duration")}: {course.classId.studyTime}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {participant.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {participant.dateOfBirth}
                              </Typography>
                            </TableCell>
                            <TableCell>{course.classId.teacherName}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {course.classId.day}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {course.classId.startTime} - {course.classId.endTime}
                              </Typography>
                            </TableCell>
                            <TableCell>{course.classId.learning_platform.platform}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {t("code")}: {course.classId.learning_platform.access_code}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="a"
                                href={course.classId.learning_platform.access_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="primary"
                              >
                                {t("joinClass")}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Collapse>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCourses;
