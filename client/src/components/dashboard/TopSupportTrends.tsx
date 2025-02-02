import { ChartPieIcon } from "lucide-react";
import "./TopSupportTrends.css";

interface FocusArea {
  name: string;
  count: number;
}

interface TrendItem {
  icon?: React.ReactNode;
  iconColor?: string;
  category: string;
  description: string;
  focusAreas: string[];
}

interface TopSupportTrendsProps {
  trendsData: TrendItem[];
}

export function TopSupportTrends({ trendsData }: TopSupportTrendsProps) {
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
              {item.icon || <ChartPieIcon />}
            </div>
            <h3 className="trend-category">{item.category}</h3>
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