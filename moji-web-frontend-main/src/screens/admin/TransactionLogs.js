// src/screens/admin/TransactionLogs.js
import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import TransactionLogTable from "../../components/TransactionLogTable";

const TransactionLogs = () => {
  const { isLoading } = useSelector((state) => state.admin);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaction Logs
      </Typography>
      <TransactionLogTable isAdmin={true} />
    </Box>
  );
};

export default TransactionLogs;
