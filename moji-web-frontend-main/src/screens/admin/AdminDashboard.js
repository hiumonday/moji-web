import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  fetchAllUsers,
  fetchTransactions,
} from "../../redux/actions/adminAction";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      {/* Rest of your dashboard content */}
    </Box>
  );
};

export default AdminDashboard;
