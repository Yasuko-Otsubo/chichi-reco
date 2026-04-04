"use client";

import { RecordGraphData } from "@/types/record";
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  chartData: RecordGraphData[];
  range: string;
}

export const GraphChart: React.FC<Props> = ({ chartData, range }) => {
  const formatTick = (v: string) => {
    const date = new Date(v);
    if (range === "7days") {
      return ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    }
    if (range === "1month") {
      const day = date.getDate();
      if (day === 1 || day === 8 || day === 15 || day === 22 || day === 29) {
        return `${day}日`;
      }
      return "";
    }
    if (range === "6month") {
      if (date.getDate() <= 7) {
        return `${date.getMonth() + 1}月`;
      }
      return "";
    }
    if (range === "1year") {
      return `${date.getMonth() + 1}月`;
    }
    return `${date.getFullYear()}年`;
  };
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          stroke="var(--color-text-3)"
          interval={0}
        />
        <YAxis yAxisId="left" domain={[50, 70]} />
        <YAxis yAxisId="right" orientation="right" domain={["auto", "auto"]} />
        <Line yAxisId="left" dataKey="weight"></Line>
        <Bar yAxisId="right" dataKey="steps" fill="pink"></Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};
