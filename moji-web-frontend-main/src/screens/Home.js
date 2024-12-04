import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Courses from "../components/courses";
import Helmet from "react-helmet";
import Hero from "../components/hero";
import SectionTitle from "../components/sectionTitle";
import { useBenefits } from "../components/data";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
// import Faq from "../components/faq";
import Partners from "../components/Partners";
import Initiatives from "../components/foundation";
const Home = () => {
  const { t } = useTranslation();
  const { benefitOne } = useBenefits();

  return (
    <>
      <Helmet>
        <title>{t('homePageTitle')}</title>
        <meta
          name="description"
          content={t('homePageDescription')}
        />
        <meta property="og:title" content={t('homePageOgTitle')} />
        <meta name="keywords" content={t('homePageKeywords')} />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Hero />
	  <Partners />

      <SectionTitle
        pretitle={t('benefitsPretitle')}
        title={t('benefitsTitle')}>
      </SectionTitle>
      <Benefits data={benefitOne} />
	  <Courses />

     
      <Testimonials />
      {/* <SectionTitle pretitle={t('faqPretitle')} title={t('faqTitle')}>
      </SectionTitle> */}
      {/* <Faq /> */}
	  <Initiatives />
      <Footer />

    </>
  );
}

export default Home;