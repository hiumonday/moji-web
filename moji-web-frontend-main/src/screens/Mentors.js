import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import MentorCard from "../components/MentorCard";
import { Container, Grid } from "@mui/material";
import mentorsData from "../data/mentors.json";

const Mentors = () => {
  const { t } = useTranslation();
  const [mentorImages, setMentorImages] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const images = {};
      for (const mentor of mentorsData.mentors) {
        try {
          // Dynamic import of images
          const image = await import(`../assets/img/${mentor.image}`);
          images[mentor.image] = image.default;
        } catch (error) {
          console.error(`Failed to load image for ${mentor.name}:`, error);
          // Set a default image or placeholder
          images[mentor.image] = "https://via.placeholder.com/200x200";
        }
      }
      setMentorImages(images);
    };

    loadImages();
  }, []);

  const renderMentorSubtitle = (experienceKey, educationKey) => {
    return `${t(experienceKey)}\n${t(educationKey)}`;
  };

  return (
    <>
      <Helmet>
        <title>{t("mentorsPageTitle")} | Moji Education</title>
        <meta name="description" content={t("mentorsPageDescription")} />
        <meta property="og:title" content={t("mentorsPageOgTitle")} />
        <meta name="keywords" content={t("mentorsPageKeywords")} />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {t("mentorsTitle")}
          </h2>
          <p className="text-lg leading-8 text-gray-600">
            {t("mentorsDescription")}
          </p>
        </div>

        <Grid container spacing={4} justifyContent="center">
          {mentorsData.mentors.map((mentor) => (
            <Grid item xs={12} sm={6} md={4} key={mentor.id}>
              <MentorCard
                image={
                  mentorImages[mentor.image] ||
                  "https://via.placeholder.com/200x200"
                }
                title={mentor.name}
                subtitle={renderMentorSubtitle(
                  mentor.experienceKey,
                  mentor.educationKey
                )}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Mentors;
