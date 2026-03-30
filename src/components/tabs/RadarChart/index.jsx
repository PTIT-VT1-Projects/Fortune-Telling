import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { features, getFeatureDetails } from "../features";

const RadarChart = ({
  width,
  height,
  overallEvaluation,
  overallEvaluationScores,
  isPrinting = false,
}) => {
  const featureDetails = getFeatureDetails(
    overallEvaluation,
    overallEvaluationScores,
  );

  const safeFeatures = features || [
    { label: "Ngoại hình" },
    { label: "Tính cách" },
    { label: "Lối sống" },
    { label: "Sở thích" },
    { label: "Điểm mạnh" },
    { label: "Điểm..." },
  ];

  const data = safeFeatures.map((feature, index) => ({
    subject: feature.label,
    score: featureDetails?.scores?.[index] ?? 0,
    fullMark: 10,
  }));

  const colors = {
    fill: "#FFC0CB",
    stroke: "#FF69B4",
    grid: "#E0E0E0",
    axisText: "#333333",
    radiusText: "#000000",
  };

  const chartWidth = width || 400;
  const chartHeight = height || 370;

  const chart = (
    <RechartsRadar
      width={chartWidth}
      height={chartHeight}
      cx="50%"
      cy="50%"
      outerRadius="80%"
      data={data}
      margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
    >
      <PolarGrid gridType="polygon" stroke={colors.grid} />

      <PolarAngleAxis
        dataKey="subject"
        tick={{ fill: colors.axisText, fontSize: 13, fontWeight: 500 }}
      />

      <PolarRadiusAxis
        angle={90}
        domain={[0, 10]}
        tickCount={6}
        tick={{ fill: colors.radiusText, fontSize: 12, fontWeight: "bold" }}
        axisLine={false}
      />

      <Radar
        name="Score"
        dataKey="score"
        stroke={colors.stroke}
        fill={colors.fill}
        fillOpacity={0.6}
        isAnimationActive={false}
        dot={{ r: 4, fill: colors.stroke, stroke: "#fff", strokeWidth: 1 }}
      />
    </RechartsRadar>
  );

  if (isPrinting) {
    return (
      <div
        style={{
          width: chartWidth,
          height: chartHeight,
          margin: "0 auto",
        }}
      >
        {chart}
      </div>
    );
  }

  return (
    <div style={{ width: width || "100%", height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        {chart}
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
