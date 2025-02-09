import React from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminNavbar from "./admin/AdminNavbar";
import AdminSidebar from "./admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminNavbar />
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          pt: "24px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
