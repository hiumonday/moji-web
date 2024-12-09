import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import EnFlag from "../assets/en.png";
import ViFlag from "../assets/vie.webp";

const Navbar = ({ changeLanguage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div>
      <header className="mx-0 md:mx-8 px-4 z-[1300] bg-white">
        <nav className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 flex-grow">
            <NavLink to="/" className="flex items-center">
              <img src={Logo} alt="top-logo" className="h-12" />
              <div className="hidden md:flex flex justify-center ml-2">
                <h1 className="text-2xl font-bold text-indigo-800 uppercase">
                  MOJI
                </h1>
                <h2 className="text-2xl ml-1 font-bold text-yellow-800 uppercase">
                  EDUCATION
                </h2>
              </div>
            </NavLink>
            {
              <div className="flex items-center gap-2 md:gap-6 hidden sm:block mx-auto">
                <NavLink
                  to="/"
                  className={`font-medium text-sm cursor-pointer p-1 rounded font-mono text-indigo-600 ${
                    currentPath === "/" ? "bg-blue-100 py-1 px-2" : ""
                  }`}
                >
                  {t("home")}
                </NavLink>
                <NavLink
                  to="/about-us"
                  className={`font-medium text-sm ml-3 cursor-pointer p-1 rounded font-mono text-indigo-600 ${
                    currentPath === "/about-us" ? "bg-blue-100 py-1 px-2" : ""
                  }`}
                >
                  {t("aboutMoji")}
                </NavLink>
                <NavLink
                  to="/courses"
                  className={`font-medium text-indigo-600 ml-3 text-sm cursor-pointer p-1 rounded font-mono ${
                    currentPath.startsWith("/courses")
                      ? "bg-blue-100 py-1 px-2"
                      : ""
                  }`}
                >
                  {t("courses")}
                </NavLink>
              </div>
            }
            <NavLink to="/cart">
              <ion-icon size="large" name="cart-outline"></ion-icon>
            </NavLink>
            <NavLink
              to="/login"
              className={`text-sm cursor-pointer  font-mono py-2 px-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-900 min-w-[120px] text-center hidden lg:block ${
                currentPath === "/login" ? "underline" : ""
              }`}
            >
              <p className="whitespace-nowrap">{t("login")}</p>
            </NavLink>
            <NavLink
              to="/register"
              className={`text-sm cursor-pointer font-mono py-2 px-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-900 min-w-[120px] text-center hidden lg:block ${
                currentPath === "/register" ? "underline" : ""
              }`}
            >
              <p className="whitespace-nowrap">{t("registerNow")}</p>
            </NavLink>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={getFlag(i18n.language)}
                  alt={`${i18n.language} Flag`}
                  className="h-4 w-6 mr-1"
                />
                <span className="mr-1">
                  {i18n.language === "en" ? "English" : "Tiếng Việt"}
                </span>
                <svg
                  className={`fill-current h-4 w-4 transition-transform duration-200 ${
                    open ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={() => {
                        changeLanguage("en");
                        setOpen(false);
                      }}
                    >
                      <img
                        src={EnFlag}
                        alt="English Flag"
                        className="h-2 w-3 mr-2"
                      />
                      English
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={() => {
                        changeLanguage("vi");
                        setOpen(false);
                      }}
                      style={{ whiteSpace: "nowrap" }} // Add this line
                    >
                      <img
                        src={ViFlag}
                        alt="Vietnamese Flag"
                        className="h-2 w-4 mr-2"
                      />
                      Tiếng Việt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <hr className="border-1 border-gray-300 w-full" />
    </div>
  );
};

export default Navbar;
