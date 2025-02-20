import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const MentorCard = ({ image, title, subtitle }) => {
  return (
    <Card
      sx={{
        maxWidth: 280,
        width: "100%",
        backgroundColor: "#F0F7FF", // Light blue background
        border: "0.25px solid #E0E0E0", // Subtle border
        borderRadius: 2,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{
          objectFit: "cover",
          borderBottom: "0.25px solid #E0E0E0",
        }}
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            color: "#1E3A8A", // Dark blue for title
            marginBottom: 1,
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            color: "#4B5563", // Gray for subtitle
            lineHeight: 1.6,
            fontSize: "0.875rem",
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MentorCard;
