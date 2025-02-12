import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import Footer from "./footer";
import { Spinner } from "./spinner"; // Import Spinner component

const CourseDetail = (i18n) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isSticky, setIsSticky] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/courses/${id}`)
      .then((response) => response.json())
      .then((data) => setCourse(data.course))
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!course)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Spinner className="mb-4" />
          <p className="text-gray-600">
            {i18n.language === "en" ? "Loading..." : "Đang tải..."}{" "}
          </p>
        </div>
      </div>
    );

  const hasEarlyBirdSlots = course.earlyBirdSlot > 0;

  return (
    <>
      <div className="min-h-screen bg-white relative z-50">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full">
          <img
            src={course.image || "/default-image.jpg"}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              {hasEarlyBirdSlots ? (
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-green-400">
                    {course.earlyBirdPrice.toLocaleString()} VNĐ
                  </p>
                  <p className="text-2xl line-through text-gray-300">
                    {course.price.toLocaleString()} VNĐ
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-white">
                  ${course.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {i18n.language === "en"
                    ? "Course Description "
                    : "Thông tin khóa học"}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Class Schedule</h2>
                <div className="space-y-4">
                  {course.classes.map((classInfo, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {classInfo.level} - {classInfo.language}
                      </h3>
                      <p className="text-gray-600">
                        {i18n.language === "en" ? "Teacher: " : "Giáo viên: "}
                        {classInfo.teacherName}
                      </p>
                      <p className="text-gray-600">
                        {classInfo.day}, {classInfo.startTime} -{" "}
                        {classInfo.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
                <div className="flex space-x-4">
                  <AddToCartButton course={course} i18n={i18n} />
                  <button className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-300">
                    {i18n.language === "en" ? "Buy now" : "Mua ngay"}
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-4">Course Highlights</h2>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Professional
                    instructors
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Flexible
                    class schedules
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Hands-on
                    projects
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Certificate
                    upon completion
                  </li>
                </ul>
                {hasEarlyBirdSlots && (
                  <p className="mt-4 text-center text-sm text-red-600 font-semibold">
                    Only {course.earlyBirdSlot} early bird slots left!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar (Mobile Only) */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md transition-all duration-300 ${
            isSticky ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="px-4 py-3 flex justify-between items-center">
            <div>
              {hasEarlyBirdSlots ? (
                <div className="flex items-center">
                  <p className="text-sm line-through text-gray-400 mr-2">
                    ${course.price.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${course.earlyBirdPrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold">
                  ${course.price.toLocaleString()}
                </p>
              )}
            </div>
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetail;
