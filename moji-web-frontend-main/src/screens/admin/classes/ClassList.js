import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  removeStudentFromClass,
} from "../../../redux/actions/classActions";

const ClassRow = ({ classItem, onDeleteStudent }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{classItem.courseName}</TableCell>
        <TableCell>{classItem.level}</TableCell>
        <TableCell>{classItem.teacherName}</TableCell>
        <TableCell>{classItem.students?.length || 0}</TableCell>
        <TableCell>
          <Chip
            label={classItem.is_active ? "Active" : "Inactive"}
            color={classItem.is_active ? "success" : "default"}
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
              <Table size="small" aria-label="students">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Registered By</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classItem.students?.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell component="th" scope="row">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.dateOfBirth}</TableCell>
                      <TableCell>{student.registeredBy}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() =>
                            onDeleteStudent(classItem._id, student._id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
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
};

const ClassList = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleDeleteStudent = (classId, studentId) => {
    setStudentToDelete({ classId, studentId });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      dispatch(
        removeStudentFromClass(
          studentToDelete.classId,
          studentToDelete.studentId
        )
      );
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#FFFFFF" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Class Management
        </Typography>
        <Typography color="textSecondary">
          Monitor and manage class enrollments and student information
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Course</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((classItem) => (
              <ClassRow
                key={classItem._id}
                classItem={classItem}
                onDeleteStudent={handleDeleteStudent}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this student from the class?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteStudent} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassList;
