import React, { useState, useRef, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/userAction";
import Logo from "../assets/logo.png";
import EnFlag from "../assets/en.png";
import ViFlag from "../assets/vie.webp";
import { useTranslation } from "react-i18next";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = ({ changeLanguage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { i18n, t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
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

  const handleLogout = () => {
    dispatch(logoutAction());
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
  ];

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
            </Disclosure.Button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <NavLink to="/">
                <img src={Logo} alt="MOJI Logo" className="h-8 w-auto" />
              </NavLink>
            </div>

            {/* Navigation links */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Language and Profile Section */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-sm font-medium text-gray-400 hover:text-white"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={getFlag(i18n.language)}
                  alt={`${i18n.language} Flag`}
                  className="h-4 w-6 mr-1"
                />
                <span>{i18n.language === "en" ? "English" : "Tiếng Việt"}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      changeLanguage("en");
                      setOpen(false);
                    }}
                  >
                    English
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      changeLanguage("vi");
                      setOpen(false);
                    }}
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>
            {/* Profile Menu or Login/Register buttons based on authentication state */}
            <div className="ml-3">
              {isAuthenticated && user ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={
                        user.avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt="User avatar"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 ring-1 ring-black ring-opacity-5">
                    <Menu.Item>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("yourProfile")}
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
                    className="w-32 text-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 hover:text-white rounded-md px-3 py-2"
                  >
                    {t("login")}
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="w-32 text-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 hover:text-white rounded-md px-3 py-2"
                  >
                    {t("registerNow")}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Disclosure.Panel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
};

export default Navbar;
