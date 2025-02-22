import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Giả lập i18n nếu bạn không dùng react-i18next
const useTranslation = () => {
  return {
    i18n: {
      language: "vi", // hoặc 'en'
    },
  };
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
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("list");
  const userState = useSelector((state) => state.user);
  const user = userState?.user || null;
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, i18n.language);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setError(null);
      const response = await fetch("/api/v1/my-courses", {
        credentials: "include",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setCourses(data.enrolledCourses);
    } catch (error) {
      console.error(error);
      setError({
        message:
          i18n.language === "en"
            ? "Failed to load courses. Please try again later."
            : "Không thể tải khóa học. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const today = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    return courses.filter((course) => course.classId.day === today);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseId.instructor
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.courseId.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const stats = {
    totalCourses: courses.length,
    inProgress: courses.filter((c) => c.participants?.length > 0).length,
    completed: 0,
    // Replace hoursThisWeek with classesToday
    classesToday: getTodaySchedule().length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center text-red-500">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold">
              {i18n.language === "en" ? "Error" : "Lỗi"}
            </h3>
          </div>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <button
            onClick={() => fetchCourses()}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            {i18n.language === "en" ? "Try Again" : "Thử lại"}
          </button>
        </div>
      </div>
    );
  }

  const renderCourseCard = (course) => (
    <div key={course.id} className="overflow-hidden rounded-lg bg-white shadow">
      <div className="flex flex-col md:flex-row">
        <div className="aspect-video w-full md:w-48">
          <img
            src={course.courseId.image || "/placeholder.svg"}
            alt={course.courseId.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.courseId.title}
                </h3>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                  {course.courseId.level}
                </span>
              </div>

              {/* Course Details */}
              <div className="mt-2 space-y-2 text-gray-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{course.classId.teacherName}</span>
                </div>

                {/* Schedule Info */}
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {i18n.language === "en"
                      ? `${course.classId.day} ${course.classId.startTime} - ${course.classId.endTime}`
                      : `${
                          {
                            Monday: "Thứ 2",
                            Tuesday: "Thứ 3",
                            Wednesday: "Thứ 4",
                            Thursday: "Thứ 5",
                            Friday: "Thứ 6",
                            Saturday: "Thứ 7",
                            Sunday: "Chủ nhật",
                          }[course.classId.day]
                        } ${course.classId.startTime} - ${course.classId.endTime}`}
                  </span>
                </div>

                {/* Participants */}
                {course.participants && course.participants.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      {i18n.language === "en" ? "Participants:" : "Học viên:"}
                    </p>
                    <div className="mt-1 space-y-1">
                      {course.participants.map((participant, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {participant.name} (
                          {new Date(
                            participant.dateOfBirth
                          ).toLocaleDateString()}
                          )
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Link */}
            {course.classId.learning_platform && (
              <a
                href={course.classId.learning_platform.access_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:mt-0"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {i18n.language === "en"
                  ? `Join ${course.classId.learning_platform.platform}`
                  : `Vào lớp ${course.classId.learning_platform.platform}`}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {`${getGreeting(i18n.language)}, ${user?.name || (i18n.language === "en" ? "Student" : "Học viên")}!`}
            </h1>
            <p className="mt-1 text-gray-500">
              {i18n.language === "en"
                ? "Here's what's happening with your courses today"
                : "Đây là tình hình học tập của bạn hôm nay"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-white shadow-sm">
              <button
                onClick={() => setView("list")}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-lg ${
                  view === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                {i18n.language === "en" ? "List" : "Danh sách"}
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-lg ${
                  view === "calendar"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {i18n.language === "en" ? "Calendar" : "Lịch"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                {i18n.language === "en" ? "Total Courses" : "Tổng số khóa học"}
              </h3>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {stats.totalCourses}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {i18n.language === "en"
                ? "Enrolled courses"
                : "Khóa học đã đăng ký"}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                {i18n.language === "en" ? "In Progress" : "Đang học"}
              </h3>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {stats.inProgress}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                {i18n.language === "en" ? "Completed" : "Đã hoàn thành"}
              </h3>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {stats.completed}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {i18n.language === "en"
                ? "Finished courses"
                : "Khóa học đã hoàn thành"}
            </p>
          </div>

          {/* Replace the last stats card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                {i18n.language === "en"
                  ? "Classes Today"
                  : "Số lớp học ngày hôm nay"}
              </h3>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {stats.classesToday}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {i18n.language === "en" ? "Classes" : "Lớp học"}
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={
                i18n.language === "en" ? "Search courses..." : "Tìm khóa học..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">
              {i18n.language === "en" ? "All Levels" : "Tất cả"}
            </option>
            <option value="Beginner">
              {i18n.language === "en" ? "Beginner" : "Cơ bản"}
            </option>
            <option value="Intermediate">
              {i18n.language === "en" ? "Intermediate" : "Trung cấp"}
            </option>
            <option value="Advanced">
              {i18n.language === "en" ? "Advanced" : "Nâng cao"}
            </option>
          </select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Course List / Calendar View */}
          <div className="lg:col-span-7">
            {view === "list" ? (
              <div className="grid gap-6">
                {filteredCourses.map((course) => renderCourseCard(course))}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-4 shadow">
                {/* Simple Calendar View - You can enhance this with a proper calendar library */}
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {Array.from({ length: 35 }, (_, i) => (
                    <button
                      key={i}
                      className="aspect-square rounded-lg border border-gray-200 p-2 text-sm hover:bg-gray-50"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule Timeline */}
          <div className="lg:col-span-5">
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {formattedDate}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
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
                        <div className="relative flex-1">
                          <div className="absolute left-0 top-2 h-full w-px bg-gray-200"></div>
                          {coursesAtTime.length > 0 ? (
                            coursesAtTime.map((course) => (
                              <div
                                key={course.id}
                                className="mb-2 ml-4 rounded-lg border border-blue-100 bg-blue-50 p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-blue-700">
                                    {course.courseId.title}
                                  </div>
                                  <span className="ml-2 rounded-full border border-blue-200 px-2 py-0.5 text-xs text-blue-700">
                                    {course.classId.startTime} -{" "}
                                    {course.classId.endTime}
                                  </span>
                                </div>
                                {course.classId.learning_platform && (
                                  <a
                                    href={
                                      course.classId.learning_platform
                                        .access_link
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center text-xs text-blue-600 hover:underline"
                                  >
                                    <svg
                                      className="mr-1 h-3 w-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                    {i18n.language === "en"
                                      ? `Join ${course.classId.learning_platform.platform}`
                                      : `Vào lớp ${course.classId.learning_platform.platform}`}
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="ml-4 p-3 text-sm text-gray-500">
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
    </div>
  );
}
