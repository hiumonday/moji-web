import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, History } from "lucide-react";
import { Collapse } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Spinner } from "./spinner";
import PropTypes from "prop-types";

// Styled component for smooth transition
const StyledCollapse = styled(Collapse)(({ theme }) => ({
  "& .MuiCollapse-wrapper": {
    transition: theme.transitions.create(["margin", "height"], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString, i18n) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(i18n.language === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TransactionLogTable = ({ isAdmin = false }) => {
  const { i18n } = useTranslation();
  const [openRowId, setOpenRowId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [isAdmin]);

  const fetchTransactions = async () => {
    try {
      const endpoint = isAdmin
        ? "/api/v1/admin/transactions"
        : "/api/v1/transaction-history";

      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setOpenRowId(openRowId === id ? null : id);
  };

  const getStatusColor = (status) => {
    const statusText = {
      PENDING: i18n.language === "en" ? "PENDING" : "CHỜ THANH TOÁN",
      COMPLETED: i18n.language === "en" ? "COMPLETED" : "HOÀN THÀNH",
      CANCELLED: i18n.language === "en" ? "CANCELLED" : "ĐÃ HỦY",
    };

    switch (status) {
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-800",
          text: statusText.PENDING,
        };
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-800",
          text: statusText.COMPLETED,
        };
      case "CANCELLED":
        return { color: "bg-red-100 text-red-800", text: statusText.CANCELLED };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Spinner className="mb-4" />
          <p className="text-gray-600">
            {i18n.language === "en"
              ? "Loading transactions..."
              : "Đang tải giao dịch..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <History className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            {error
              ? i18n.language === "en"
                ? "Error loading transactions"
                : "Lỗi tải giao dịch"
              : i18n.language === "en"
                ? "No transactions yet!"
                : "Chưa có giao dịch nào!"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {error
              ? error
              : i18n.language === "en"
                ? "Your transaction history is empty."
                : "Lịch sử giao dịch của bạn đang trống."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div
        className="overflow-x-auto scrollbar-visible"
        style={{
          maxHeight: "70vh",
          overflowY: "scroll", // Always show vertical scrollbar
          scrollbarGutter: "stable", // Reserves space for scrollbar
          scrollbarWidth: "thin", // For Firefox
        }}
      >
        <style jsx global>{`
          .scrollbar-visible::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .scrollbar-visible::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .scrollbar-visible::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .scrollbar-visible::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
        `}</style>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Order Code" : "Mã đơn hàng"}
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Date" : "Ngày đặt"}
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Name" : "Tên"}
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Status" : "Trạng thái"}
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Total Amount" : "Tổng tiền"}
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Participants" : "Học viên"}
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                {i18n.language === "en" ? "Action" : "Thao tác"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <React.Fragment key={transaction._id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.orderCode}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date, i18n)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-gray-500">{transaction.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusColor(transaction.status).color
                      }`}
                    >
                      {getStatusColor(transaction.status).text}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toggleDropdown(transaction._id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      {transaction.participants.length}{" "}
                      {i18n.language === "en" ? "Students" : "Học viên"}
                      {openRowId === transaction._id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.status === "PENDING" &&
                      transaction.checkoutUrl && (
                        <a
                          href={transaction.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Tiếp tục thanh toán
                        </a>
                      )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="7" className="p-0">
                    <StyledCollapse in={openRowId === transaction._id}>
                      <div className="px-4 py-4 bg-gray-50">
                        <div className="grid gap-4">
                          {transaction.participants.map(
                            (participant, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {participant.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {participant.course_title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {participant.class_title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {i18n.language === "en"
                                      ? "Discount"
                                      : "Giảm giá"}
                                    : {participant.discount_type}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    {formatCurrency(participant.tution_fee)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </StyledCollapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TransactionLogTable.propTypes = {
  isAdmin: PropTypes.bool,
};

export default TransactionLogTable;
