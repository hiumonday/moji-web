import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createDiscount,
  getAllDiscounts,
} from "../../../redux/actions/discountActions";

const ManageDiscount = () => {
  const dispatch = useDispatch();
  const {
    discounts,
    loading: reduxLoading,
    error: reduxError,
  } = useSelector((state) => state.discount);

  const [discountType, setDiscountType] = useState("event");
  const [eventDiscountData, setEventDiscountData] = useState({
    discount_code: "",
    percentage: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, [dispatch]);

  const fetchDiscounts = async () => {
    try {
      await dispatch(getAllDiscounts());
      setError(null);
    } catch (error) {
      setError(error.message || "Error fetching discounts");
      console.error("Error fetching discounts:", error);
    }
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!eventDiscountData.discount_code.trim()) {
        throw new Error("Discount code is required");
      }

      if (!eventDiscountData.expiresAt) {
        throw new Error("Expiration date is required");
      }

      const discountPayload = {
        discount_code: eventDiscountData.discount_code,
        expiresAt: eventDiscountData.expiresAt,
        discount_type: discountType,
      };

      // Add percentage only for event discounts
      if (discountType === "event") {
        const percentage = Number(eventDiscountData.percentage);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          throw new Error("Percentage must be between 0 and 100");
        }
        discountPayload.percentage = percentage;
      }

      await dispatch(createDiscount(discountPayload));

      // Reset form
      setEventDiscountData({
        discount_code: "",
        percentage: "",
        expiresAt: "",
      });

      // Show success message
      setShowSuccess(true);

      // Refresh discount list
      fetchDiscounts();
    } catch (error) {
      setError(error.message || "Error creating discount");
      console.error("Error creating discount:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Manage Discounts
      </Typography>

      {/* Success message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Discount created successfully!
        </Alert>
      </Snackbar>

      {/* Error message */}
      {(error || reduxError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || reduxError}
        </Alert>
      )}

      {/* Create Discount Card */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create Discount
        </Typography>
        <form onSubmit={handleDiscountSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Discount Type"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                disabled={loading || reduxLoading}
              >
                <MenuItem value="event">Event Discount</MenuItem>
                <MenuItem value="alumni">Alumni Discount</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Discount Code"
                value={eventDiscountData.discount_code}
                onChange={(e) =>
                  setEventDiscountData({
                    ...eventDiscountData,
                    discount_code: e.target.value,
                  })
                }
                required
              />
            </Grid>
            {discountType === "event" && (
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Percentage"
                  value={eventDiscountData.percentage}
                  onChange={(e) =>
                    setEventDiscountData({
                      ...eventDiscountData,
                      percentage: e.target.value,
                    })
                  }
                  required
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
            )}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Expires At"
                value={eventDiscountData.expiresAt}
                onChange={(e) =>
                  setEventDiscountData({
                    ...eventDiscountData,
                    expiresAt: e.target.value,
                  })
                }
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || reduxLoading}
                sx={{ mt: 1 }}
              >
                {loading || reduxLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  `Create ${discountType === "event" ? "Event" : "Alumni"} Discount`
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* Discounts Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Active Discounts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Discount Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discounts?.map((discount) => (
              <TableRow key={discount._id}>
                <TableCell>{discount.discount_code}</TableCell>
                <TableCell>
                  {discount.discount_type === "event" ? "Event" : "Alumni"}
                </TableCell>
                <TableCell>
                  {discount.discount_type === "event"
                    ? `${discount.percentage}%`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(discount.expiresAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(discount.expiresAt) > new Date()
                    ? "Active"
                    : "Expired"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageDiscount;
