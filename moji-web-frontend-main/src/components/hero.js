import { useTranslation } from 'react-i18next';
import Container from "./container";
import heroImg from "../assets/thanhcong.webp";
import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";

import Logo from "../assets/logo.png";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              {t('heroTitle')}
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href={process.env.REACT_APP_API_URL + "/api/v1/auth/google"}
                className="h-16 px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md"
              >
                <div className="flex items-center">
                  <img src={Logo} alt="Google" className="h-8" />
                  <span className="ml-2 font-medium text-white">{t('startLearning')}</span>
                </div>
              </a>
              <a
                href={"https://www.facebook.com/MojiSATPlatform/"}
                className="h-16 px-8 py-4 text-lg font-medium text-center text-white border border-indigo-600 rounded-md bg-white"
              >
                <div className="flex items-center">
                  <img src={Facebook} alt="Google" className="h-6" />
                  <span className="ml-2 font-medium text-black">{t('contactUs')}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <img
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </>
  );
}

export default Hero;