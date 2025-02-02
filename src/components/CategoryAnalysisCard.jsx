import React, { useState, useEffect } from "react";
import "./CategoryAnalysisCard.css";

function CategoryAnalysisCard({ title, value }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Simple micro-animation for the numeric value
    let startValue = 0;
    const endValue = parseInt(value, 10);
    const duration = 1000; // 1 second
    const frameRate = 60;  // 60 fps
    const increment = (endValue - startValue) / (duration / frameRate);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        startValue = endValue;
        clearInterval(timer);
      }
      setAnimatedValue(Math.floor(startValue));
    }, duration / frameRate);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="category-analysis-card">
      <h2 className="category-card-title">{title}</h2>
      <p className="category-card-value">{animatedValue}%</p>
    </div>
  );
}

export default CategoryAnalysisCard; 