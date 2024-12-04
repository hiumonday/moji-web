import React from "react";
import { useTranslation } from 'react-i18next';
import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../assets/gallery/mojitt.webp";
import benefitTwoImg from "../assets/img/benefit-two.png";

export const useBenefits = () => {
  const { t } = useTranslation();

  const benefitOne = {
    title: t('benefitOne.title'),
    desc: t('benefitOne.desc'),
    image: benefitOneImg,
    bullets: t('benefitOne.bullets', { returnObjects: true }).map((item, index) => ({
      title: item.title,
      desc: item.desc,
      icon: index === 0 ? <FaceSmileIcon /> : index === 1 ? <ChartBarSquareIcon /> : <CursorArrowRaysIcon />,
    })),
  };

  const benefitTwo = {
    title: t('benefitTwo.title'),
    desc: t('benefitTwo.desc'),
    image: benefitTwoImg,
    bullets: t('benefitTwo.bullets', { returnObjects: true }).map((item, index) => ({
      title: item.title,
      desc: item.desc,
      icon: index === 0 ? <SunIcon /> : index === 1 ? <DevicePhoneMobileIcon /> : <AdjustmentsHorizontalIcon />,
    })),
  };

  return { benefitOne, benefitTwo };
};