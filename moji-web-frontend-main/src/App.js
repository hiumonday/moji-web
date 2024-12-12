import { useEffect, forwardRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import { getUserAction } from "./redux/actions/userAction";
import NotFound from "./screens/NotFound";
import { HelmetProvider } from "react-helmet-async";
import Home from "./screens/Home";
import { Alert, Snackbar } from "@mui/material";
import { clearError, clearSuccess } from "./redux/slices/appSlice";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import viTranslation from "./locales/vi/translation.json";
import AboutUs from "./screens/AboutUs";
import Courses from "./screens/Courses";
import DF from "./screens/DF";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Cart from "./screens/Cart";
import DemoComponent from "./components/DemoComponent";
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    vi: {
      translation: viTranslation,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// main.js
const App = () => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.appState);
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
      <Router>
        <div className="bg-white min-h-screen">
          <Navbar changeLanguage={changeLanguage} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/debating-fundamentals" element={<DF />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/demo" element={<DemoComponent />} />

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
      </Router>
    </HelmetProvider>
  );
};

export default App;
