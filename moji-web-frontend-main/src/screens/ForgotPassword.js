import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setError, setSuccess } from "../redux/slices/appSlice";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/password/forgot", { email });
      if (response.data.success) {
        dispatch(setSuccess(t("PasswordResetSent")));
        setEmail("");
      }
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to send reset email")
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Helmet>
        <title>{t("forgotPassword")}</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t("forgotPassword")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("enterEmailForReset")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t("sending") : t("sendResetLink")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
