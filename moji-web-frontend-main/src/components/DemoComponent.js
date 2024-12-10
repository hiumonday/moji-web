import React, { useEffect } from "react";
import api from "../api.js";

const DemoComponent = () => {
  // useEffect(() => {
  //     fetch("/api/v1/demo")
  //         .then((response) => response.json())
  //         .then((data) => console.log("Response from backend:", data))
  //         .catch((error) => console.error("Error fetching API:", error));
  // }, []); // Empty dependency array ensures this runs only once on mount
  useEffect(() => {
    api
      .get("/demo")
      .then((response) => {
        console.log("Response from backend:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching API:",
          error.response?.data || error.message
        );
      });
  }, []);

  return (
    <div>
      <h1>Demo API Forwarding</h1>
      <p>Check the console for the API response.</p>
    </div>
  );
};

export default DemoComponent;
