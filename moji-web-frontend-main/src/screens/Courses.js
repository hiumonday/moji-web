import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";
import SectionTitle from "../components/sectionTitle";
import Footer from "../components/footer";
import Container from "../components/container";
import CourseCard from "../components/CourseCard";
import { Spinner } from "../components/spinner"; // Import Spinner component

const Courses = () => {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]); // State to store courses
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch courses from the database
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/v1/courses");
        const data = await response.json();
        console.log("API Response:", data);

        if (data.data) {
          setCourses(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch courses");
        }
      } catch (err) {
        setError(err.message || "Failed to load courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Add function to filter courses by type
  const filterCoursesByType = (type) => {
    return courses.filter((course) => course.type === type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Spinner className="mb-4" />
          <p className="text-gray-600">
            {i18n.language === "en" ? "Loading..." : "Đang tải..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const nonContactCourses = filterCoursesByType("non_contact_based");
  const contactCourses = filterCoursesByType("contact_based");

  return (
    <>
      <Helmet>
        <title>{t("coursesPageTitle")}</title>
        <meta name="description" content={t("coursesPageDescription")} />
        <meta property="og:title" content={t("coursesPageOgTitle")} />
        <meta name="keywords" content={t("coursesPageKeywords")} />
      </Helmet>

      {/* First Section - Non-contact Based Courses */}
      <section className="bg-gray-50">
        <Container>
          <SectionTitle
            pretitle={t("coursesPagePretitle")}
            title="Chương trình Đào tạo"
          ></SectionTitle>
          <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3 py-12 px-10">
            {nonContactCourses.map((course) => (
              <CourseCard key={course._id} course={course} i18n={i18n} />
            ))}
          </div>
        </Container>
      </section>

      {/* Second Section - Contact Based Courses */}
      <section className="bg-white">
        <Container>
          <SectionTitle
            pretitle={t("coursesPagePretitle")}
            title="Chương trình Huấn luyện"
          ></SectionTitle>
          <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3 py-12 px-10">
            {contactCourses.map((course) => (
              <CourseCard key={course._id} course={course} i18n={i18n} />
            ))}
          </div>
        </Container>
      </section>

      {/* <SectionTitle
        pretitle={t("satPrepPretitle")}
        title={t("satPrepTitle")}
      ></SectionTitle>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl mx-auto">
          {courses.slice(3, 5).map((course, index) => (
            <div key={index} className="lg:col-auto xl:col-auto">
              <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={index === 0 ? courseFourImg : courseFiveImg}
                    alt={course.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-base">
                    {course.description}
                  </p>
                </div>
                <div className="px-6 py-4">
                  <a
                    href={course.link}
                    className="inline-block bg-blue-400 hover:bg-blue-600 text-white font-semibold mb-3 py-2 px-4 rounded"
                  >
                    {i18n.language === "en" ? "View Course" : "Xem Khóa Học"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container> */}

      <Footer />
    </>
  );
};

export default Courses;
