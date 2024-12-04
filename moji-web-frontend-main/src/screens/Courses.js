import React from "react";
import { useTranslation } from 'react-i18next';
import Helmet from "react-helmet";
import SectionTitle from "../components/sectionTitle";
import Footer from "../components/footer";
import Container from "../components/container";
import courseOneImg from "../assets/courses/DF.webp";
import courseTwoImg from "../assets/courses/DD.webp";
import courseThreeImg from "../assets/courses/private.webp";
import courseFourImg from "../assets/img/course2.jpeg";
import courseFiveImg from "../assets/courses/sat2.webp";

const Courses = () => {
  const { t, i18n } = useTranslation();
  const courses = t('courseslist2', { returnObjects: true });

  return (
    <>
      <Helmet>
        <title>{t('coursesPageTitle')}</title>
        <meta name="description" content={t('coursesPageDescription')} />
        <meta property="og:title" content={t('coursesPageOgTitle')} />
        <meta name="keywords" content={t('coursesPageKeywords')} />
      </Helmet>

      <SectionTitle pretitle={t('debateProgramsPretitle')} title={t('debateProgramsTitle')}></SectionTitle>
      <Container>
        <div className="grid gap-10 lg:grid-cols-3 xl:grid-cols-3 max-w-6xl mx-auto">
          {courses.slice(0, 3).map((course, index) => (
            <div key={index} className="lg:col-auto xl:col-auto">
              <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={index === 0 ? courseOneImg : index === 1 ? courseTwoImg : courseThreeImg}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-base">{course.description}</p>
                </div>
                <div className="px-6 py-4">
                  <a
                    href={course.link}
                    className="inline-block bg-blue-400 hover:bg-blue-600 text-white font-semibold mb-3 py-2 px-4 rounded"
                  >
                    {i18n.language === 'en' ? 'View Course' : 'Xem Khóa Học'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <SectionTitle pretitle={t('satPrepPretitle')} title={t('satPrepTitle')}></SectionTitle>
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
                  <p className="text-gray-600 text-base">{course.description}</p>
                </div>
                <div className="px-6 py-4">
                  <a
                    href={course.link}
                    className="inline-block bg-blue-400 hover:bg-blue-600 text-white font-semibold mb-3 py-2 px-4 rounded"
                  >
                    {i18n.language === 'en' ? 'View Course' : 'Xem Khóa Học'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default Courses;