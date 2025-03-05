// src/components/Banner.jsx
import React from "react";

const Banner = ({ onAnalyze }) => {
  return (
    <div className="banner">
      <h2 className="banner-title">Want to analyze a coin? Let AI do it for you!</h2>
      <button onClick={onAnalyze} className="banner-button">
        Analyze Now
      </button>
    </div>
  );
};

export default Banner;
