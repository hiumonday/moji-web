import React, { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import ConsultationButton from "./ConsultationButton";
import {
  ChevronRightIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const CustomAlert = forwardRef((props, ref) => (
  <Alert elevation={6} variant="filled" {...props} ref={ref} />
));

const CourseCard = ({ course, i18n }) => {
  const navigate = useNavigate();
  console.log("Course type:", course.type); // Debug log

  const renderViewCourseButton = () => (
    <div className="flex-1">
      <button
        onClick={() => navigate(`/courses/${course._id}`)}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
      >
        {i18n.language === "en" ? "View Course" : "Xem Khóa Học"}
        <ChevronRightIcon className="ml-2 h-4 w-4" />
      </button>
    </div>
  );

  const renderActionButtons = () => {
    console.log("Rendering action buttons for course:", {
      id: course._id,
      type: course.type,
      title: course.title,
    });

    if (course.type === "contact_based") {
      return (
        <div className="grid grid-cols-2 gap-2">
          {renderViewCourseButton()}
          <ConsultationButton course={course} i18n={i18n} />
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-2">
          {renderViewCourseButton()}
          <AddToCartButton course={course} i18n={i18n} />
        </div>
      );
    }
  };

  return (
    <div className="lg:col-auto xl:col-auto">
      <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <img
            src={course.image || "/default-image.jpg"}
            alt={course.title}
            className="w-full h-60 object-cover"
          />
          {course.type === "non_contact_based" && course.price && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
              {course.earlyBirdSlot > 0 && course.earlyBirdPrice
                ? course.earlyBirdPrice.toLocaleString()
                : course.price.toLocaleString()}{" "}
              VND
            </div>
          )}
        </div>
        <div className="px-6 py-4 flex-grow">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            {course.title}
          </h3>
          {course.classes && course.classes.length > 0 && (
            <>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                <span>
                  {course.classes.length}{" "}
                  {i18n.language === "en"
                    ? "classes available"
                    : "lớp học có sẵn"}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                <span>
                  {i18n.language === "en" ? "Language" : "Ngôn ngữ giảng dạy"}
                  {": "}
                  {Array.from(
                    new Set(course.classes.map((c) => c.language))
                  ).join(", ")}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50">{renderActionButtons()}</div>
      </div>
    </div>
  );
};

export default CourseCard;
