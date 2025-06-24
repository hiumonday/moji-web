import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { UserIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AddToCartDialog = ({ isOpen, onClose, course, i18n, onAddToCart }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false);
  const [numParticipants, setNumParticipants] = useState(1);
  const [participants, setParticipants] = useState([
    {
      name: "",
      dateOfBirth: "",
      isAlumni: false,
      alumniCoupon: "",
      couponValid: null,
    },
  ]);
  const [adding, setAdding] = useState(false);
  const [verifyingCoupon, setVerifyingCoupon] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClassSelection = (classItem) => {
    setSelectedClass(classItem);
    setIsParticipantDialogOpen(true);
  };

  const handleNumParticipantsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumParticipants(num);
    setParticipants(
      Array.from({ length: num }, () => ({
        name: "",
        dateOfBirth: "",
        isAlumni: false,
        alumniCoupon: "",
        couponValid: null,
      }))
    );
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const checkAlumniCoupon = async (index) => {
    if (verifyingCoupon !== null) return;

    setVerifyingCoupon(index);
    const couponCode = participants[index].alumniCoupon;

    console.log("Button clicked - Starting alumni verification");
    console.log("Current participant data:", participants[index]);

    if (!couponCode) {
      showNotification(
        i18n.language === "en"
          ? "Please enter an alumni code"
          : "Vui lòng nhập mã cựu học viên",
        "error"
      );
      setVerifyingCoupon(null);
      return;
    }

    try {
      const requestUrl = "/api/v1/check-alumni";
      const requestBody = { couponCode: couponCode.trim() };

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const result = await response.json();

      if (response.status === 401) {
        showNotification(
          i18n.language === "en"
            ? "Please login to verify alumni code"
            : "Vui lòng đăng nhập để xác nhận mã cựu học viên",
          "error"
        );
        setVerifyingCoupon(null);
        return;
      }

      const updatedParticipants = [...participants];
      if (response.ok && result.success) {
        updatedParticipants[index] = {
          ...updatedParticipants[index],
          isAlumni: true,
          couponValid: true,
          alumniCoupon: couponCode,
        };
        showNotification(
          i18n.language === "en"
            ? "Alumni code verified successfully!"
            : "Mã cựu học viên đã được xác nhận!"
        );
      } else {
        updatedParticipants[index] = {
          ...updatedParticipants[index],
          isAlumni: false,
          couponValid: false,
          alumniCoupon: couponCode,
        };
        showNotification(
          i18n.language === "en"
            ? result.message || "Invalid alumni code"
            : "Mã cựu học viên không hợp lệ",
          "error"
        );
      }
      setParticipants(updatedParticipants);
    } catch (err) {
      console.error("API call error:", err);
      showNotification(
        i18n.language === "en"
          ? "Error verifying alumni code. Please try again."
          : "Lỗi khi xác nhận mã cựu học viên. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setVerifyingCoupon(null);
    }
  };

  const handleSubmit = async () => {
    setAdding(true);
    try {
      await onAddToCart(selectedClass, participants);
      showNotification(
        i18n.language === "en"
          ? "Successfully added to cart!"
          : "Đã thêm vào giỏ hàng thành công!"
      );
      onClose();
    } catch (error) {
      showNotification(
        i18n.language === "en"
          ? "Error adding to cart. Please try again."
          : "Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-[9999] transition-all duration-300 ease-in-out bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md h-[90vh] overflow-y-auto relative">
        {/* First Dialog */}
        <div
          className={`transform transition-all duration-500 ease-in-out absolute inset-0 ${
            isParticipantDialogOpen
              ? "opacity-0 -translate-x-full pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {i18n.language === "en" ? "Choose a Class" : "Chọn Lớp Học"}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              {i18n.language === "en"
                ? "Please select a class for this course."
                : "Vui lòng chọn một lớp học cho khóa học này."}
            </p>
            <div className="mb-4 max-h-[50vh] overflow-y-auto">
              {course.classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className={`p-3 mb-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedClass && selectedClass._id === classItem._id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleClassSelection(classItem)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-base text-gray-800">{`${classItem.level} - ${classItem.language}`}</span>
                    {selectedClass && selectedClass._id === classItem._id && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>{classItem.teacherName}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{`${classItem.day}, ${classItem.startTime} - ${classItem.endTime}`}</span>
                  </div>
                  {classItem.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span>{classItem.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                {i18n.language === "en" ? "Cancel" : "Hủy"}
              </button>
              <button
                onClick={() => setIsParticipantDialogOpen(true)}
                disabled={!selectedClass}
                className={`px-3 py-2 text-sm border border-transparent rounded-md text-white ${
                  !selectedClass
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                } transition-colors duration-300`}
              >
                {i18n.language === "en" ? "Next" : "Tiếp theo"}
              </button>
            </div>
          </div>
        </div>

        {/* Second Dialog */}
        <div
          className={`transform transition-all duration-500 ease-in-out absolute inset-0 ${
            isParticipantDialogOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {i18n.language === "en"
                ? "Participant Information"
                : "Thông tin người tham gia"}
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {i18n.language === "en"
                  ? "Number of Participants"
                  : "Số lượng người tham gia"}
              </label>
              <input
                type="number"
                min="1"
                value={numParticipants}
                onChange={handleNumParticipantsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {participants.map((participant, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-700 mb-3 text-sm">
                    {i18n.language === "en"
                      ? `Participant ${index + 1}`
                      : `Người tham gia ${index + 1}`}
                  </h3>

                  <div className="mb-3">
                    <label className="block text-gray-700 text-xs font-bold mb-1">
                      {i18n.language === "en" ? "Full Name" : "Họ và tên"}
                    </label>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) =>
                        handleParticipantChange(index, "name", e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={
                        i18n.language === "en"
                          ? "Enter full name"
                          : "Nhập họ và tên"
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs font-bold mb-1">
                      {i18n.language === "en" ? "Date of Birth" : "Ngày sinh"}
                    </label>
                    <input
                      type="date"
                      value={participant.dateOfBirth}
                      onChange={(e) =>
                        handleParticipantChange(
                          index,
                          "dateOfBirth",
                          e.target.value
                        )
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs font-bold mb-1">
                      {i18n.language === "en"
                        ? "Alumni Coupon"
                        : "Mã cựu học sinh"}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={participant.alumniCoupon}
                        onChange={(e) =>
                          handleParticipantChange(
                            index,
                            "alumniCoupon",
                            e.target.value
                          )
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder={
                          i18n.language === "en"
                            ? "Enter alumni coupon (optional)"
                            : "Nhập mã cựu học sinh (không bắt buộc)"
                        }
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          checkAlumniCoupon(index);
                        }}
                        disabled={verifyingCoupon !== null}
                        className={`ml-2 px-3 py-2 text-sm border border-transparent rounded-md text-white min-w-[80px]
                          ${
                            verifyingCoupon === index
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          } 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
                      >
                        {verifyingCoupon === index ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : i18n.language === "en" ? (
                          "Check"
                        ) : (
                          "Kiểm tra"
                        )}
                      </button>
                    </div>
                    {participant.couponValid === true && (
                      <p className="text-green-500 text-xs mt-1">
                        {i18n.language === "en"
                          ? "You are an alumni!"
                          : "Bạn là cựu học viên!"}
                      </p>
                    )}
                    {participant.couponValid === false && (
                      <p className="text-red-500 text-xs mt-1">
                        {i18n.language === "en"
                          ? "Invalid coupon code"
                          : "Mã không hợp lệ"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsParticipantDialogOpen(false)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                {i18n.language === "en" ? "Back" : "Quay lại"}
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-2 text-sm border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
              >
                {adding ? (
                  <CircularProgress size={20} color="inherit" />
                ) : i18n.language === "en" ? (
                  "Add to Cart"
                ) : (
                  "Thêm vào giỏ"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddToCartDialog;
