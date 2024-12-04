import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Container from "./container";
import SectionTitle from "./sectionTitle";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import logos
import logo1 from "../assets/partners/vtv7.webp";
import logo2 from "../assets/partners/olym.webp";
import logo3 from "../assets/partners/suv.webp";
import logo4 from "../assets/partners/thanhcong.webp";
import logo5 from "../assets/partners/vnu.webp";
import logo6 from "../assets/partners/igc.webp";
import logo7 from "../assets/partners/thanglong.webp";
import logo8 from "../assets/partners/banmai.webp";

const Partners = () => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const partners = [
    { logo: logo1, alt: t('partner1') },
    { logo: logo2, alt: t('partner2') },
    { logo: logo3, alt: t('partner3') },
    { logo: logo4, alt: t('partner4') },
    { logo: logo5, alt: t('partner5') },
    { logo: logo6, alt: t('partner6') },
    { logo: logo7, alt: t('partner7') },
    { logo: logo8, alt: t('partner8') },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: !isHovered,
    autoplaySpeed: 0,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="pb-10 bg-gray-50">
      <Container>
        <SectionTitle
          pretitle={t('partnersPretitle')}
          title={t('partnersTitle')}
          align="center"
        />

        <div className="mt-10">
          <Slider {...settings} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {partners.map((partner, index) => (
              <div key={index} className="px-4">
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    title={partner.alt}
                    className="max-w-full max-h-full grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 w-full h-10 flex items-center justify-center opacity-0 hover:opacity-100 bg-white bg-opacity-75 transition-opacity duration-300">
                    <span className="text-sm font-medium">{partner.alt}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </Container>
    </section>
  );
};

export default Partners;