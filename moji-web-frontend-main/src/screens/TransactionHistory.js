import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TransactionHistory = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Mock data - replace this with actual data from your backend
  const transactions = [
    {
      id: 1,
      courseName: "Web Development Masterclass - Online Certification Course",
      date: "Oct 25, 2024",
      price: "đ0",
      paymentType: "Free Coupon",
      receipt: true,
    },
    {
      id: 2,
      courseName: "The Complete Java Course: From Basics to Advanced",
      date: "Sep 20, 2024",
      price: "đ0",
      paymentType: "Free Coupon",
      receipt: true,
    },
    {
      id: 3,
      courseName: "Professional Diploma in Pricing Analysis and Management",
      date: "Aug 30, 2024",
      price: "đ0",
      paymentType: "Free Coupon",
      receipt: true,
    },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-medium text-gray-600">
          {t("pleaseLoginToViewProfile")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">
            {t("transactionHistory")}
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <a
              href="#"
              className="border-b-2 border-blue-500 py-4 px-6 text-sm font-medium text-blue-600"
            >
              {t("courses")}
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              {t("subscriptions")}
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              {t("refunds")}
            </a>
          </nav>
        </div>

        {/* Transaction List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("item")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("totalPrice")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("paymentType")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("receipt")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <span className="inline-block h-10 w-10 rounded-lg bg-gray-100 text-gray-500 p-2">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.courseName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.paymentType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {transaction.receipt ? (
                      <button className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md">
                        {t("receipt")}
                      </button>
                    ) : (
                      <span className="text-gray-400">
                        {t("invoiceUnavailable")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
