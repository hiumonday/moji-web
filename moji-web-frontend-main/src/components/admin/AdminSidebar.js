import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import {
  School as CourseIcon,
  People as UsersIcon,
  Receipt as TransactionsIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Class as ClassIcon,
  Chat as ConsultationIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { text: "Courses", path: "/admin/courses", icon: <CourseIcon /> },
    { text: "Classes", path: "/admin/classes", icon: <ClassIcon /> },
    { text: "Users", path: "/admin/users", icon: <UsersIcon /> },
    {
      text: "Consultations",
      path: "/admin/consultations",
      icon: <ConsultationIcon />,
    },
    {
      text: "Transactions",
      path: "/admin/transactions",
      icon: <TransactionsIcon />,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <>
      <Toolbar>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              height: 48,
              borderRadius: "8px",
              mb: 0.5,
              color: "text.secondary",
              "&.Mui-selected": {
                backgroundColor: "primary.lighter",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.lighter",
                },
              },
              "&:hover": {
                backgroundColor: "action.hover",
                color: "text.primary",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            left: mobileOpen ? drawerWidth + 16 : 16,
            top: 16,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            bgcolor: "background.paper",
            boxShadow: 1,
            transition: "left 0.3s",
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "background.paper",
              backgroundImage: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        // Desktop Drawer
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.paper",
              backgroundImage: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default AdminSidebar;
