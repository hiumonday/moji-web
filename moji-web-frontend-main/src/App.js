import React, { useEffect, useState, forwardRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import CourseDetail from "./components/CourseDetail";
import { getUserAction } from "./redux/actions/userAction";
import Navbar from "./components/Navbar";
import NotFound from "./screens/NotFound";
import { HelmetProvider } from "react-helmet-async";
import Home from "./screens/Home";
import { Alert, Snackbar, Box } from "@mui/material";
import { clearError, clearSuccess } from "./redux/slices/appSlice";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import viTranslation from "./locales/vi/translation.json";
import AboutUs from "./screens/AboutUs";
import UserCourses from "./screens/Courses";
import DF from "./screens/DF";
import Login from "./screens/Login";
import Register from "./screens/Register";
import CheckOut from "./screens/CheckOut";
import Cart from "./screens/Cart";
import DemoComponent from "./components/DemoComponent";
import Profile from "./screens/Profile";
import TransactionHistory from "./screens/TransactionHistory";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminCourses from "./screens/admin/Courses";
import Users from "./screens/admin/Users";
import TransactionLogs from "./screens/admin/TransactionLogs";
import AdminLogin from "./screens/admin/AdminLogin";
import ProtectedRoute from "./utils/ProtectedRoute";
import ClassList from "./screens/admin/classes/ClassList";
import MyCourses from "./screens/MyCourses";
import ConsultationManagement from "./screens/admin/Consultation";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    vi: {
      translation: viTranslation,
    },
  },
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

// main.js
const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state) => state.user || { user: null, isAuthenticated: false }
  );
  const { error, success } = useSelector(
    (state) => state.appState || { error: null, success: null }
  );
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const CustomAlert = forwardRef((props, ref) => (
    <Alert elevation={6} variant="filled" {...props} ref={ref} />
  ));
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    dispatch(getUserAction());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setIsErrorOpen(true);
    } else if (success) {
      setIsSuccessOpen(true);
    }
  }, [error, success]);

  const handleErrorClose = () => {
    setIsErrorOpen(false);
    dispatch(clearError());
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    dispatch(clearSuccess());
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="bg-white min-h-screen">
          {!window.location.pathname.startsWith("/admin") && (
            <Navbar changeLanguage={changeLanguage} />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Layout>
                    <Login />
                  </Layout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/demo" element={<DemoComponent />} />
            <Route path="/check-out" element={<CheckOut />} />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Layout>
                    <Profile />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/transaction-history"
              element={<TransactionHistory />}
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/courses" element={<UserCourses />} />
            <Route path="/debating-fundamentals" element={<DF />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <Box sx={{ minHeight: "100vh", overflow: "auto" }}>
                  <AdminLayout>
                    <Routes>
                      <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                      />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="courses/*" element={<AdminCourses />} />
                      <Route path="classes" element={<ClassList />} />
                      <Route path="users" element={<Users />} />
                      <Route
                        path="consultations"
                        element={<ConsultationManagement />}
                      />
                      <Route
                        path="transactions"
                        element={<TransactionLogs />}
                      />
                    </Routes>
                  </AdminLayout>
                </Box>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses/:id" element={<CourseDetail i18n={i18n} />} />
            <Route
              path="/transaction-history"
              element={<TransactionHistory />}
            />
            <Route
              path="/my-courses"
              element={
                isAuthenticated ? (
                  <Layout>
                    <MyCourses />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <Snackbar
            open={isErrorOpen}
            autoHideDuration={3000}
            onClose={handleErrorClose}
          >
            <CustomAlert
              onClose={handleErrorClose}
              severity="error"
              className="w-fit mx-auto md:mr-auto "
            >
              {error}
            </CustomAlert>
          </Snackbar>
          <Snackbar
            open={isSuccessOpen}
            autoHideDuration={3000}
            onClose={handleSuccessClose}
          >
            <CustomAlert
              onClose={handleSuccessClose}
              severity="success"
              className="w-fit mx-auto md:mr-auto "
            >
              {success}
            </CustomAlert>
          </Snackbar>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
