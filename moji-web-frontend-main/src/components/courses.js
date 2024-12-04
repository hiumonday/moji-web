import React from "react";
import Container from "./container";
import { useTranslation } from 'react-i18next';
import courseOneImg from "../assets/img/course1.jpeg";
import courseTwoImg from "../assets/img/course2.jpeg";
import courseThreeImg from "../assets/img/course3.jpeg";
import SectionTitle from "./sectionTitle";
const Courses = () => {
  const { t, i18n } = useTranslation();

  const courses = t('courseslist', { returnObjects: true });

  return (
    <div>
        <SectionTitle
    pretitle={t('coursePretitle')}
    title={t('courseTitle')}>
  </SectionTitle>
    <Container>
      <div className="grid gap-10 lg:grid-cols-3 xl:grid-cols-3 max-w-6xl mx-auto">
        {courses.map((course, index) => (
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
                  className="inline-block bg-blue-300 hover:bg-blue-600 text-white font-semibold mb-3 py-2 px-4 rounded"
                >
                  {i18n.language === 'en' ? 'View Course' : 'Xem Khóa Học'}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container></div>
  );
}

export default Courses;