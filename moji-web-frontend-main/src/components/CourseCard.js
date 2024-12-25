import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const CourseCard = ({ course, i18n }) => {
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false);
  const [numParticipants, setNumParticipants] = useState(1);
  const [participants, setParticipants] = useState([
    { name: "", dateOfBirth: "" },
  ]);

  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!selectedClass) {
      setError(
        i18n.language === "en"
          ? "Please select a class"
          : "Vui lòng chọn một lớp học"
      );
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/v1/add-to-cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course._id,
          classId: selectedClass._id,
          participants,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setIsDialogOpen(false);
        setIsParticipantDialogOpen(false);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        throw new Error(result.message || "Failed to add course to cart");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 2000);
    } finally {
      setAdding(false);
    }
  };

  const handleClassSelection = (classItem) => {
    setSelectedClass(classItem);
    setIsParticipantDialogOpen(true);
  };

  const handleNumParticipantsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumParticipants(num);
    setParticipants(
      Array.from({ length: num }, () => ({ name: "", dateOfBirth: "" }))
    );
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
    setSelectedClass(null);
    setIsParticipantDialogOpen(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsParticipantDialogOpen(false);
  };

  return (
    <div className="lg:col-auto xl:col-auto">
      <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <img
            src={course.image || "/default-image.jpg"} // Sử dụng ảnh mặc định nếu không có
            alt={course.title}
            className="w-full h-60 object-cover"
          />
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
            {course.earlyBirdSlot > 0
              ? course.earlyBirdPrice.toLocaleString()
              : course.price.toLocaleString()}{" "}
            VND
          </div>
        </div>
        <div className="px-6 py-4 flex-grow">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            {course.title}
          </h3>
          {/* <p className="text-gray-600 text-sm mb-4">
            {i18n.language === "en" ? "Teacher: " : "Giáo viên: "}
            {Array.from(new Set(course.classes.map((c) => c.teacherName))).join(
              ", "
            )}
          </p> */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            <span>
              {course.classes.length}{" "}
              {i18n.language === "en" ? "classes available" : "lớp học có sẵn"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <GlobeAltIcon className="h-5 w-5 mr-2" />
            <span>
              {i18n.language === "en" ? "Language" : "Ngôn ngữ giảng dạy"}
              {": "}
              {Array.from(new Set(course.classes.map((c) => c.language))).join(
                ", "
              )}
            </span>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/courses/${course._id}`)}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {i18n.language === "en" ? "View Course" : "Xem Khóa Học"}
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={openDialog}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              {i18n.language === "en" ? "Add to Cart" : "Thêm vào giỏ"}
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
        {success && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white px-4 py-2 text-center transition-all duration-300 transform translate-y-0">
            {i18n.language === "en"
              ? "Added to cart!"
              : "Đã thêm vào giỏ hàng!"}
          </div>
        )}
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center transition-all duration-300 transform translate-y-0">
            {i18n.language === "en" ? `Error: ${error}` : `Lỗi: ${error}`}
          </div>
        )}
      </div>

      <div
        className={`fixed inset-0 bg-black flex items-center justify-center p-4 z-50 transition-all duration-300 ease-in-out ${
          isDialogOpen
            ? "bg-opacity-50 opacity-100 pointer-events-auto"
            : "bg-opacity-0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-lg p-6 w-full h-[500px] max-w-md transform transition-all duration-500 ease-in-out ${
            isParticipantDialogOpen ? "translate-x-[-2rem]" : "translate-x-1/2"
          } flex-shrink-0 min-h-[400px]`}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {i18n.language === "en" ? "Choose a Class" : "Chọn Lớp Học"}
          </h2>
          <p className="mb-4 text-gray-600">
            {i18n.language === "en"
              ? "Please select a class for this course."
              : "Vui lòng chọn một lớp học cho khóa học này."}
          </p>
          <div className="mb-4 max-h-60 overflow-y-auto">
            {course.classes.map((classItem) => (
              <div
                key={classItem._id}
                className={`p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedClass && selectedClass._id === classItem._id
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleClassSelection(classItem)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg text-gray-800">{`${classItem.level} - ${classItem.language}`}</span>
                  {selectedClass && selectedClass._id === classItem._id && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>{classItem.teacherName}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{`${classItem.day}, ${classItem.startTime} - ${classItem.endTime}`}</span>
                </div>
                {classItem.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{classItem.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeDialog}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {i18n.language === "en" ? "Cancel" : "Hủy"}
            </button>
            <button
              onClick={() => setIsParticipantDialogOpen(true)}
              disabled={!selectedClass}
              className={`px-4 py-2 border border-transparent rounded-md text-white ${
                !selectedClass
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              } transition-colors duration-300`}
            >
              {i18n.language === "en" ? "Next" : "Tiếp theo"}
            </button>
          </div>
        </div>
        {/* Dialog 2 */}
        <div
          className={`bg-white rounded-lg p-6 w-full h-[500px] max-w-md transform transition-all duration-500 ease-in-out ${
            isParticipantDialogOpen
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "translate-x-[-100%] opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
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

          <div className="max-h-[400px] overflow-y-auto">
            {participants.map((participant, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-4">
                  {i18n.language === "en"
                    ? `Participant ${index + 1}`
                    : `Người tham gia ${index + 1}`}
                </h3>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {i18n.language === "en" ? "Full Name" : "Họ và tên"}
                  </label>
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) =>
                      handleParticipantChange(index, "name", e.target.value)
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={
                      i18n.language === "en"
                        ? "Enter full name"
                        : "Nhập họ và tên"
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsParticipantDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {i18n.language === "en" ? "Back" : "Quay lại"}
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              {i18n.language === "en" ? "Add to Cart" : "Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
