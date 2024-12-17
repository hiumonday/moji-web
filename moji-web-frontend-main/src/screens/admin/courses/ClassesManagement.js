import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchClasses } from "../../../redux/actions/courseActions";

// Row component for expandable content
function ClassRow({ classData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{classData.courseName}</TableCell>
        <TableCell>{classData.level}</TableCell>
        <TableCell>{classData.teacherName}</TableCell>
        <TableCell>{classData.students?.length || 0}</TableCell>
        <TableCell>
          <Chip
            label={classData.status}
            color={classData.status === "active" ? "success" : "default"}
            size="small"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Students
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Join Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classData.students?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={
                            student.status === "active" ? "success" : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(student.joinDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const ClassesManagement = () => {
  const dispatch = useDispatch();
  const { classes, isLoading } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

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
      <Typography variant="h5" gutterBottom>
        Class Management
      </Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50} />
                <TableCell>Course</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <ClassRow key={classItem._id} classData={classItem} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ClassesManagement;
