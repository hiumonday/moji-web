import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import axiosInstance from "../../utils/axios";
import { setError, setSuccess } from "../../redux/slices/appSlice";

const ConsultationManagement = () => {
  const dispatch = useDispatch();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      const { data } = await axiosInstance.get("/api/v1/admin/consultations");
      setConsultations(data.consultations);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to fetch consultations"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (consultationId, newStatus) => {
    try {
      await axiosInstance.patch(
        `/api/v1/admin/consultations/${consultationId}`,
        {
          status: newStatus,
        }
      );
      dispatch(setSuccess("Status updated successfully"));
      fetchConsultations(); // Refresh the list
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to update status")
      );
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getStatusChipColor = (status) => {
    return status === "pending" ? "warning" : "success";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Consultation Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultations.map((consultation) => (
              <TableRow key={consultation._id}>
                <TableCell>{consultation.name}</TableCell>
                <TableCell>{consultation.phone}</TableCell>
                <TableCell>{consultation.courseTitle}</TableCell>
                <TableCell>{consultation.note || "-"}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={consultation.status}
                      onChange={(e) =>
                        handleStatusChange(consultation._id, e.target.value)
                      }
                      sx={{ minWidth: 120 }}
                      renderValue={(value) => (
                        <Chip
                          label={value.charAt(0).toUpperCase() + value.slice(1)}
                          size="small"
                          color={getStatusChipColor(value)}
                        />
                      )}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {new Date(consultation.createdAt).toLocaleString("en-US", {
                    timeZone: "Asia/Bangkok",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConsultationManagement;
