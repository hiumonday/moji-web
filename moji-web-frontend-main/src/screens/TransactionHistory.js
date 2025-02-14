import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer";
import Container from "../components/container";
import Helmet from "react-helmet";
import TransactionLogTable from "../components/TransactionLogTable";
import PropTypes from "prop-types";

const TransactionHistory = ({ isAdmin = false }) => {
  const { i18n } = useTranslation();

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
