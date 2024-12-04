// DF.js
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet';
import Footer from '../components/footer';
import PhotoAlbum from "react-photo-album";

import debate1 from '../assets/courses/df/mohinh.jpeg';
import debate2 from '../assets/courses/df/mentor.jpeg';



// const photos = [
//   { src: debate1, width: 1800, height: 1600 },
//   { src: debate2, width: 2000, height: 1800 },
//   { src: debate3, width: 1400, height: 1200 },
//   { src: debate4, width: 2400, height: 1600 },
//   { src: debate5, width: 1600, height: 1200 },
//   { src: debate6, width: 2400, height: 1800 },
//   { src: debate7, width: 3200, height: 1800 },
//   { src: debate8, width: 1600, height: 1200 },
// ];

const DF = () => {
  const { t } = useTranslation();
  const countUpRef1 = useRef(null);
  const countUpRef2 = useRef(null);
  const countUpRef3 = useRef(null);
  const countUpRef4= useRef(null);



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            entry.target.start();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countUpRef1.current) {
      observer.observe(countUpRef1.current.spanElement);
    }
    if (countUpRef2.current) {
      observer.observe(countUpRef2.current.spanElement);
    }
    if (countUpRef3.current) {
      observer.observe(countUpRef3.current.spanElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>{t('debateFundamentalsPageTitle')}</title>
        <meta
          name="description"
          content={t('debateFundamentalsPageDescription')}
        />
        <meta property="og:title" content={t('debateFundamentalsPageOgTitle')} />
        <meta name="keywords" content={t('debateFundamentalsPageKeywords')} />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
<section className="course-structure bg-white py-16">
  <div className="container mx-auto px-4">
    <div className="text-center text-md font-bold tracking-wider text-indigo-600 pb-4 uppercase mx-auto">
      {t('courseStructure')}
    </div>
    <div className="max-w-3xl mx-auto mb-24">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t('courseStructureTitle')}
      </h2>
    </div>
    <div className="flex flex-row items-center justify-center mx-auto max-w-6xl">
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 relative">
        <div className="relative z-10">
          <img
            src={debate2}
            alt={t('courseStructureImage')}
            className="shadow-lg"
          />
        </div>
      </div>
      <div className="md:w-1/2 ml-6">
        <h3 className="text-3xl font-bold mb-4 ml-16">{t('courseStructureTitle2')}</h3>
        <p className="text-lg leading-relaxed mb-6 ml-16">
          {t('courseStructureDescription')}
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Course Highlights */}
      <section className="course-highlights py-12 mt-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="md:text-left my-auto">
              <h2 className="text-2xl font-bold mb-4">{t('courseHighlightsTitle')}</h2>
              <p className='max-w-xl pr-12 text-lg'>{t('courseHighlightsDescription')}</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">{t('topicsCovered')}</h3>
                <div className="flex justify-center">
                  <CountUp end={5000000} duration={5} ref={countUpRef3} className="text-2xl font-bold text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500 ml-1">VND</span>
                </div>
              </div>
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">{t('debateExercises')}</h3>
                <div className="flex justify-center">
                  <CountUp end={100} duration={3} ref={countUpRef4} className="text-2xl font-bold text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500 ml-1">%</span>
                </div>
              </div>
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">{t('studentsTaughtDF')}</h3>
                <div className="flex justify-center">
                  <CountUp end={100} duration={2} ref={countUpRef1} className="text-2xl font-bold text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500 ml-1">+</span>
                </div>
              </div>
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">{t('courseDuration')}</h3>
                <div className="flex justify-center">
                  <CountUp end={8} duration={5} ref={countUpRef2} className="text-2xl font-bold text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500 ml-1">{t('weeks')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
  <section className="course-overview bg-white py-16">
  <div className="container mx-auto px-4">
    <div className="text-center text-md font-bold tracking-wider text-indigo-600 pb-4 uppercase mx-auto">
      {t('courseOverview')}
    </div>
    <div className="max-w-3xl mx-auto mb-24">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t('debateFundamentalsTitle2')}
      </h2>
    </div>
    <div className="flex flex-row items-center justify-center mx-auto max-w-6xl">
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 relative">
        <div className="relative z-10">
          <img
            src={debate1}
            alt={t('debateFundamentalsImage')}
            className="shadow-lg"
          />
        </div>
      </div>
      <div className="md:w-1/2 ml-6">
        {/* <h3 className="text-3xl font-bold mb-4 ml-16">{t('debateFundamentalsTitle')}</h3> */}
        <p className="text-lg leading-relaxed mb-6 ml-16">
          {t('debateFundamentalsDescription')}
        </p>
      </div>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default DF;