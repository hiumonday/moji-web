import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ChevronDown, Calendar, RotateCw } from "lucide-react";

const TransactionHistory = () => {
  const { i18n } = useTranslation();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [selectedProduct, setSelectedProduct] = useState("Sản phẩm");
  const [selectedStatus, setSelectedStatus] = useState("Trạng thái");
  const [dateRange, setDateRange] = useState("");

  // Sample transaction data
  const transactions = [
    {
      time: "10/12/2024 - 05:22",
      package: "Chuyên nghiệp - Năm",
      paymentMethod: "Chuyển khoản ngân hàng",
      amount: "đ1.934.706",
      status: "Đã huỷ",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">
        {i18n.language === "en" ? "Transaction History" : "Lịch sử giao dịch"}
      </h1>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4">Thời gian giao dịch</th>
              <th className="text-left p-4">Tên khóa học</th>
              <th className="text-left p-4">Số lượng</th>
              <th className="text-left p-4">Tổng tiền</th>
              <th className="text-left p-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{transaction.time}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"
                        />
                      </svg>
                    </div>
                    {transaction.package}
                  </div>
                </td>
                <td className="p-4">{transaction.paymentMethod}</td>
                <td className="p-4">{transaction.amount}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-red-600 bg-red-50">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị từ 1 đến 1 trong 1
      </div>
    </div>
  );
};

export default TransactionHistory;
