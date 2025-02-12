import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Clock, Users, ExternalLink, Loader } from "lucide-react";
import Helmet from "react-helmet";

const daysOfWeek = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
};

const timeSlots = Array.from(
  { length: 12 },
  (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`
);

const getGreeting = (language) => {
  const hour = new Date().getHours();
  if (language === "en") {
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  } else {
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }
};

const formatDate = (date, language) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(
    language === "en" ? "en-US" : "vi-VN",
    options
  );
};

export default function MyCourses() {
  const { i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userState = useSelector((state) => state.user);
  const user = userState?.user || null;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/v1/my-courses", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.enrolledCourses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);
  const currentMonth = selectedDate.toLocaleDateString(
    i18n.language === "en" ? "en-US" : "vi-VN",
    {
      month: "long",
      year: "numeric",
    }
  );

  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, i18n.language);

  // Filter courses for current day
  const getTodaySchedule = () => {
    const today = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    return courses.filter((course) => course.classId.day === today);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {i18n.language === "en" ? "My Courses" : "Khóa học của tôi"}
        </title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {`${getGreeting(i18n.language)}, ${user?.name || (i18n.language === "en" ? "Student" : "Học viên")}!`}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Courses */}
            <div className="lg:col-span-7">
              <div className="grid gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={course.courseId.image || "/placeholder.svg"}
                          alt={course.courseId.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold">
                            {course.courseId.title}
                          </h3>
                          <span className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full">
                            {course.courseId.level}
                          </span>
                        </div>
                        <div className="mt-2 space-y-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>{course.courseId.instructor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>
                              {i18n.language === "en"
                                ? `${course.classId.day} ${course.courseId.duration}`
                                : `${
                                    course.classId.day === "Monday"
                                      ? "Thứ 2"
                                      : course.classId.day === "Tuesday"
                                        ? "Thứ 3"
                                        : course.classId.day === "Wednesday"
                                          ? "Thứ 4"
                                          : course.classId.day === "Thursday"
                                            ? "Thứ 5"
                                            : course.classId.day === "Friday"
                                              ? "Thứ 6"
                                              : course.classId.day ===
                                                  "Saturday"
                                                ? "Thứ 7"
                                                : "Chủ nhật"
                                  } ${course.courseId.duration}`}
                            </span>
                          </div>
                          {course.classId.learning_platform && (
                            <div className="flex items-center gap-2">
                              <ExternalLink size={16} />
                              <a
                                href={
                                  course.classId.learning_platform.access_link
                                }
                                className="text-indigo-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {i18n.language === "en"
                                  ? `Join ${course.classId.learning_platform.platform}`
                                  : `Vào lớp ${course.classId.learning_platform.platform}`}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Today's Schedule */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-2">{formattedDate}</h2>
                <div className="mt-6 space-y-4">
                  {timeSlots.map((time) => {
                    const todaySchedule = getTodaySchedule();
                    const coursesAtTime = todaySchedule.filter((course) =>
                      course.classId.startTime.startsWith(time.split(":")[0])
                    );

                    return (
                      <div key={time} className="flex gap-4">
                        <div className="w-16 text-sm font-medium text-gray-500">
                          {time}
                        </div>
                        <div className="flex-1 relative">
                          <div className="absolute left-0 top-2 w-px h-full bg-gray-200" />
                          {coursesAtTime.length > 0 ? (
                            coursesAtTime.map((course) => (
                              <div
                                key={course.id}
                                className="ml-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100 mb-2"
                              >
                                <div className="font-medium text-sm text-indigo-600">
                                  {course.courseId.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {course.classId.startTime} -{" "}
                                  {course.classId.endTime}
                                </div>
                                {course.classId.learning_platform && (
                                  <a
                                    href={
                                      course.classId.learning_platform
                                        .access_link
                                    }
                                    className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {i18n.language === "en"
                                      ? `Join ${course.classId.learning_platform.platform}`
                                      : `Vào lớp ${course.classId.learning_platform.platform}`}
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="ml-4 p-3 text-sm text-gray-400">
                              {i18n.language === "en"
                                ? "No classes"
                                : "Không có lớp học"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
