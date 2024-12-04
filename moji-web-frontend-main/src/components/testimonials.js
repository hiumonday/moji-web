import React, { useState } from "react";
import Container from "./container";
import { useTranslation } from 'react-i18next';
import userOneImg from "../assets/img/user1.jpeg";
import userTwoImg from "../assets/img/user2.jpeg";
import userThreeImg from "../assets/img/user3.jpeg";
import SectionTitle from "./sectionTitle";

const Testimonials = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = t('testimonials', { returnObjects: true });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div>
      <SectionTitle pretitle={t('teamPretitle')} title={t('teamTitle')}>
        {t('teamDescription')}
      </SectionTitle>
      <Container>
        <div className="relative">
          <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-3 gap-10 max-w-6xl mx-auto pb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="lg:col-auto xl:col-auto">
                <TestimonialCard testimonial={testimonial} index={index} />
              </div>
            ))}
          </div>
          <div className="lg:hidden">
            <div className="flex justify-center">
              <TestimonialCard testimonial={testimonials[currentIndex]} index={currentIndex} />
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="px-2 py-1 mr-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                onClick={handlePrev}
              >
                &larr;
              </button>
              <button
                className="px-2 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                onClick={handleNext}
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }) => (
  <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-14 dark:bg-trueGray-800">
    <Avatar
      image={index === 0 ? userOneImg : index === 1 ? userTwoImg : userThreeImg}
      name={testimonial.name}
      title={testimonial.title}
    />
    <p className="text-lg leading-relaxed mt-5 text-gray-700">{testimonial.experience}</p>
    <p className="text-base leading-normal mt-2 font-medium text-gray-600">{testimonial.education}</p>
  </div>
);

const Avatar = (props) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 overflow-hidden rounded-full">
      <img src={props.image} width="55" height="55" alt="Avatar" placeholder="blur" />
    </div>
    <div>
      <div className="text-lg font-medium">{props.name}</div>
      <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
    </div>
  </div>
);

export default Testimonials;