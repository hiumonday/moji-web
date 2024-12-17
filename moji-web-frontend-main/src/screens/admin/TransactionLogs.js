// src/screens/admin/TransactionLogs.js
import React, { useEffect } from "react";
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
} from "@mui/material";
import { fetchTransactions } from "../../redux/actions/adminAction";

const TransactionLogs = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaction Logs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction._id}</TableCell>
                <TableCell>{transaction.user.name}</TableCell>
                <TableCell>{transaction.course.title}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionLogs;
