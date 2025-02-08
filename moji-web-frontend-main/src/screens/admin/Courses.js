import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import MyCourses from "./courses/MyCourses";
import CreateCourse from "./courses/CreateCourse";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `course-tab-${index}`,
    "aria-controls": `course-tabpanel-${index}`,
  };
}

const Courses = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#FFFFFF" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Course Management
        </Typography>
        <Typography color="textSecondary">
          Manage your courses, create new ones, and monitor class enrollments
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="course management tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
              height: "3px",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "text.secondary",
              minHeight: "48px",
              padding: "12px 16px",
              marginRight: "24px",
              "&.Mui-selected": {
                color: "#1976d2",
                fontWeight: 600,
              },
              "&:hover": {
                color: "#1976d2",
                opacity: 0.7,
              },
            },
          }}
        >
          <Tab
            icon={
              <Box
                component="span"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: tabValue === 0 ? "#1976d2" : "grey.400",
                  mr: 1,
                }}
              />
            }
            iconPosition="start"
            label="My Courses"
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <Box
                component="span"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: tabValue === 1 ? "#1976d2" : "grey.400",
                  mr: 1,
                }}
              />
            }
            iconPosition="start"
            label="Create Course"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <Box>
        <TabPanel value={tabValue} index={0}>
          <MyCourses />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CreateCourse />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Courses;
