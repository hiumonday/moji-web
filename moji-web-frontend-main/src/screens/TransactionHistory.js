import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer";
import Container from "../components/container";
import Helmet from "react-helmet";
import TransactionLogTable from "../components/TransactionLogTable";
import PropTypes from "prop-types";
import { AlertTriangle } from "lucide-react"; // Add this import

const TransactionHistory = ({ isAdmin = false }) => {
  const { i18n } = useTranslation();

  const NotificationBanner = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {i18n.language === "en"
              ? "Important Notice"
              : "Thông báo quan trọng"}
          </h3>
          <div className="text-sm text-yellow-700">
            <p>
              {i18n.language === "en"
                ? "• Pending transactions will be automatically deleted after 1 hour"
                : "• Các giao dịch đang chờ thanh toán sẽ tự động bị xóa sau 1 giờ"}
            </p>
            <p>
              {i18n.language === "en"
                ? "• Cancelled transactions will be automatically deleted after 1 week"
                : "• Các giao dịch đã hủy sẽ tự động bị xóa sau 1 tuần"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {i18n.language === "en" ? "Transaction History" : "Lịch sử giao dịch"}
        </title>
      </Helmet>
      <Container>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {i18n.language === "en"
              ? "Transaction History"
              : "Lịch sử giao dịch"}
          </h1>
          <NotificationBanner />
          <TransactionLogTable isAdmin={isAdmin} />
        </div>
      </Container>
      <Footer />
    </>
  );
};

TransactionHistory.propTypes = {
  isAdmin: PropTypes.bool,
};

export default TransactionHistory;
