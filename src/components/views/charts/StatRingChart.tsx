import React from 'react';

/**
 * @interface ChartSeries
 * @description Defines the data for a single segment of the ring chart.
 */
interface ChartSeries {
  label: string;
  value: number;
  goal: number;
  color: string;
}

/**
 * @interface StatRingChartProps
 * @description Props for the StatRingChart component.
 */
interface StatRingChartProps {
  series: ChartSeries[];
  size?: number;
}

/**
 * A component to display statistics in a multi-segment ring chart.
 * @param {StatRingChartProps} props - The props for the component.
 */
const StatRingChart: React.FC<StatRingChartProps> = ({ series, size = 200 }) => {
  const strokeWidth = 12;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {series.map((item, index) => {
          const percentage = item.goal > 0 ? (item.value / item.goal) * 100 : 0;
          const limitedPercentage = Math.min(100, percentage);
          const segmentLength = (limitedPercentage / 100) * circumference;
          const strokeDashoffset = (accumulatedPercentage / 100) * circumference;
          accumulatedPercentage += limitedPercentage;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={-strokeDashoffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{series.reduce((acc, item) => acc + item.value, 0)}</span>
        <span className="text-sm">Total</span>
      </div>
    </div>
  );
};

export default StatRingChart;
