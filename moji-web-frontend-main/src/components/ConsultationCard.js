import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createConsultation } from "../redux/actions/courseActions";
import { Dialog } from "@mui/material";

const ConsultationCard = ({ isOpen, onClose, courseId, courseTitle, i18n }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    note: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createConsultation({ ...formData, courseTitle }));
      onClose();
    } catch (error) {
      console.error("Failed to submit consultation:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">
          {i18n.language === "en"
            ? "Course Consultation"
            : "Thông tin khóa học"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {i18n.language === "en" ? "Full Name" : "Họ và tên"} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={i18n.language === "en" ? "Your name" : "Họ và tên"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {i18n.language === "en"
                ? "Phone Number"
                : "Số điện thoại liên hệ"}{" "}
              *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                i18n.language === "en" ? "Your phone number" : "Số điện thoại"
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {i18n.language === "en" ? "Note" : "Ghi chú"}
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                i18n.language === "en"
                  ? "Additional information"
                  : "Thời gian học thử"
              }
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {i18n.language === "en" ? "Cancel" : "Hủy"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {i18n.language === "en" ? "Submit" : "Gửi"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ConsultationCard;
