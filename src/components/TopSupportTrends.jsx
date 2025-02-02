import React from "react";
import "./TopSupportTrends.css";

function TopSupportTrends({ trendsData }) {
  return (
    <section className="top-support-trends">
      <header>
        <h2 className="trends-title">Top Support Trends</h2>
        <p className="trends-subtitle">
          Keep track of the most frequent issues and key focus areas affecting your support.
        </p>
      </header>

      <div className="trends-grid">
        {trendsData.map((item, index) => (
          <div className="trend-card" key={index}>
            <div className="trend-icon" style={{ color: item.iconColor || "#3b82f6" }}>
              {item.icon}
            </div>
            <h3 className="trend-category">{item.category}</h3>
            <div className="trend-badge">Trending</div>
            <p className="trend-description">{item.description}</p>

            <div className="focus-areas">
              {item.focusAreas.map((area, idx) => (
                <span className="focus-tag" key={idx}>
                  {area}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopSupportTrends; 