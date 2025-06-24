import React, { useState } from "react";
import ConsultationCard from "./ConsultationCard";

const ConsultationButton = ({ course, i18n }) => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  console.log("Rendering ConsultationButton for course:", course.title);

  return (
    <div className="flex-1">
      <button
        onClick={() => setIsConsultationOpen(true)}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
      >
        {i18n.language === "en" ? "Contact for consultation" : "Liên hệ tư vấn"}
      </button>
      <ConsultationCard
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        courseTitle={course.title}
        i18n={i18n}
      />
    </div>
  );
};

export default ConsultationButton;
