// AboutUs.js
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import Image from "../assets/img/ngocnguyen.webp";
import { Helmet } from "react-helmet";
import Footer from "../components/footer";
import PhotoAlbum from "react-photo-album";

import mojidaydream from "../assets/gallery/mojidaydream.webp";
import mojivbc from "../assets/gallery/mojivbc.webp";
import mojifdt from "../assets/gallery/mojifdt.webp";
import thanhcong from "../assets/gallery/thanhcong.webp";
import mojihdt from "../assets/gallery/mojihdt.webp";
import vnwqo from "../assets/gallery/vnwqo.webp";
import mojitt from "../assets/gallery/mojitt.webp";
import custom from "../assets/gallery/custom.webp";

const photos = [
  { src: mojidaydream, width: 1800, height: 1600 },
  { src: mojivbc, width: 2000, height: 1800 },
  { src: mojifdt, width: 1400, height: 1200 },
  { src: thanhcong, width: 2400, height: 1600 },
  { src: mojihdt, width: 1600, height: 1200 },
  { src: vnwqo, width: 2400, height: 1800 },
  { src: mojitt, width: 3200, height: 1800 },
  { src: custom, width: 1600, height: 1200 },
];

const AboutUs = () => {
  const { t } = useTranslation();
  const countUpRef1 = useRef(null);
  const countUpRef2 = useRef(null);
  const countUpRef3 = useRef(null);
  const countUpRef4 = useRef(null);

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
        <title>{t("aboutPageTitle")}</title>
        <meta name="description" content={t("aboutPageDescription")} />
        <meta property="og:title" content={t("aboutPageOgTitle")} />
        <meta name="keywords" content={t("aboutPageKeywords")} />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      {/* Our Story */}
      <section className="our-story py-8">
        <div className="container mx-auto px-4 ">
          <div className="text-center text-md font-bold tracking-wider text-indigo-600 pb-4 uppercase mx-auto">
            {t("ourMission")}
          </div>
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t("missionStatement")}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center mx-auto max-w-6xl">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 relative h-">
              <div className="relative z-10">
                <img
                  src={Image}
                  alt={t("ourStoryImage")}
                  className="shadow-lg"
                />
              </div>
            </div>
            <div className="md:w-1/2 ml-6">
              <h3 className="text-3xl font-bold mb-4 ml-16">
                {t("ourStoryTitle")}
              </h3>
              <p className="text-lg leading-relaxed mb-6 ml-16">
                {t("ourStoryDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="by-the-numbers py-12 mt-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="md:text-left my-auto">
              <h2 className="text-2xl font-bold mb-4">
                {t("byTheNumbersTitle")}
              </h2>
              <p className="max-w-xl pr-12 text-lg">
                {t("byTheNumbersDescription")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">
                  {t("programsDeveloped")}
                </h3>
                <div className="flex justify-center">
                  <CountUp
                    end={30}
                    duration={5}
                    ref={countUpRef3}
                    className="text-2xl font-bold text-blue-500"
                  />
                  <span className="text-2xl font-bold text-blue-500 ml-1">
                    +
                  </span>
                </div>
              </div>
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">
                  {t("studentInitiatives")}
                </h3>
                <div className="flex justify-center">
                  <CountUp
                    end={100}
                    duration={3}
                    ref={countUpRef4}
                    className="text-2xl font-bold text-blue-500"
                  />
                  <span className="text-2xl font-bold text-blue-500 ml-1">
                    +
                  </span>
                </div>
              </div>
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">
                  {t("studentsTaught")}
                </h3>
                <div className="flex justify-center">
                  <CountUp
                    end={1000}
                    duration={2}
                    ref={countUpRef1}
                    className="text-2xl font-bold text-blue-500"
                  />
                  <span className="text-2xl font-bold text-blue-500 ml-1">
                    +
                  </span>
                </div>
              </div>
              <div className="flex flex-col bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex-grow">
                  {t("coursesOffered")}
                </h3>
                <div className="flex justify-center">
                  <CountUp
                    end={50}
                    duration={5}
                    ref={countUpRef2}
                    className="text-2xl font-bold text-blue-500"
                  />
                  <span className="text-2xl font-bold text-blue-500 ml-1">
                    +
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mt-24 mb-3 ">
          {t("galleryTitle")}
        </h2>
        <hr className="border-t-2 border-black mx-auto w-12 mb-12 " />
        <PhotoAlbum layout="rows" photos={photos} />
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
