import React, { useState, useRef, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/userAction";
import Logo from "../assets/logo.png";
import EnFlag from "../assets/en.png";
import ViFlag from "../assets/vie.webp";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Navbar = ({ changeLanguage }) => {
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const user = userState?.user || null;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const currentPath = location.pathname;

  useEffect(() => {
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [currentPath]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }

      const menuPanel = document.getElementById("mobile-menu-panel");
      const menuButton = document.getElementById("mobile-menu-button");
      if (
        isMenuOpen &&
        menuPanel &&
        !menuPanel.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  if (currentPath.startsWith("/admin")) {
    return null; // Don't render navbar for admin routes
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction());
      setIsMenuOpen(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getFlag = (language) => {
    switch (language) {
      case "en":
        return EnFlag;
      case "vi":
        return ViFlag;
      default:
        return null;
    }
  };

  const stringAvatar = (name) => {
    console.log(user);
    return {
      sx: {
        bgcolor: deepOrange[500],
      },
      children: `${name.split(" ")[0][0].toUpperCase()}`,
    };
  };

  const navigation = [
    { name: t("home"), href: "/", current: currentPath === "/" },
    {
      name: t("aboutMoji"),
      href: "/about-us",
      current: currentPath === "/about-us",
    },
    {
      name: t("courses"),
      href: "/courses",
      current: currentPath.startsWith("/courses"),
    },
    {
      name: "Cart",
      href: "/cart",
      current: currentPath === "/cart",
    },
  ];

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <nav className="bg-white navbar-shadow sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-[72px] items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              id="mobile-menu-button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <NavLink to="/">
                <img src={Logo} alt="MOJI Logo" className="h-11 w-auto" />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-blue-500 text-white"
                        : "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
                      "rounded-md px-4 py-2.5 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right section - Language and Auth */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-base font-medium text-blue-600 hover:text-blue-700"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <img
                  src={getFlag(i18n.language)}
                  alt={`${i18n.language} Flag`}
                  className="h-4 w-6 mr-1"
                />
                <span>{i18n.language === "en" ? "English" : "Tiếng Việt"}</span>
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      changeLanguage("en");
                      setLanguageOpen(false);
                    }}
                  >
                    English
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      changeLanguage("vi");
                      setLanguageOpen(false);
                    }}
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>

            {/* Auth buttons - Only visible on desktop */}
            <div className="hidden sm:ml-3 sm:block">
              {isAuthenticated && user ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <Avatar {...stringAvatar(user.name)} />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <Menu.Item>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("myProfile")}
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink
                        to="/my-courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("myCourses")}
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink
                        to="/transaction-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("transactionHistory")}
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("settings")}
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
                      >
                        {t("logout")}
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink
                    to="/login"
                    className="w-36 text-center text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2.5 shadow-sm"
                  >
                    {t("login")}
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="w-36 text-center text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2.5 shadow-sm"
                  >
                    {t("registerNow")}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Sliding Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden z-50`}
        style={{ top: "72px" }}
        id="mobile-menu-panel"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Navigation Links */}
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={classNames(
                item.current
                  ? "bg-blue-500 text-white"
                  : "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
                "block rounded-md px-4 py-2.5 text-base font-medium w-full text-left"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="border-t border-blue-100 my-2"></div>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <>
              <NavLink
                to="/profile"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("myProfile")}
              </NavLink>
              <NavLink
                to="/settings"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("settings")}
              </NavLink>
              <button
                onClick={handleLogout}
                className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium w-full text-left"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2.5 text-base font-medium w-full text-center shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("login")}
              </NavLink>
              <NavLink
                to="/register"
                className="block text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2.5 text-base font-medium w-full text-center mt-2 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("registerNow")}
              </NavLink>
            </>
          )}

          {/* Language Selection in Mobile Menu */}
          <div className="border-t border-blue-100 my-2"></div>
          <div className="px-3 py-2">
            <div className="flex items-center text-black-300">
              <button
                className="flex items-center w-full text-sm font-medium hover:text-white"
                onClick={() => changeLanguage("en")}
              >
                <img src={EnFlag} alt="English" className="h-4 w-6 mr-2" />
                English
              </button>
            </div>
            <div className="flex items-center text-black-300 mt-2">
              <button
                className="flex items-center w-full text-sm font-medium hover:text-white"
                onClick={() => changeLanguage("vi")}
              >
                <img src={ViFlag} alt="Tiếng Việt" className="h-4 w-6 mr-2" />
                Tiếng Việt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        } sm:hidden z-40`}
        style={{ top: "72px" }}
        onClick={() => setIsMenuOpen(false)}
      ></div>
    </nav>
  );
};

export default Navbar;
