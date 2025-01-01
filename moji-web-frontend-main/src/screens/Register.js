import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Reset error dynamically when typing
    if (name === "confirmPassword" || name === "password") {
      if (
        name === "confirmPassword" &&
        formData.password &&
        value !== formData.password
      ) {
        setError(t("passwordNotMatch"));
      } else if (
        name === "password" &&
        formData.confirmPassword &&
        value !== formData.confirmPassword
      ) {
        setError(t("passwordNotMatch"));
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError(t("passwordNotMatch"));
      return;
    }

    try {
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/login");
      } else {
        alert(result.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Helmet>
        <title>{t("registerNow")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t("registerNow")}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("passWord")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("passWord")}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  {t("confirmPassWord")}
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("confirmPassWord")}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t("registerNow")}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              {t("haveAccount")}?{" "}
              <NavLink
                to="/login"
                className="font-medium text-yellow-500 hover:text-yellow-400"
              >
                {t("login")}
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
