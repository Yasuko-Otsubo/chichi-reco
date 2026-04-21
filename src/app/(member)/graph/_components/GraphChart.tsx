"use client";

import { RecordGraphData } from "@/types/record";
import {
  Bar,
  CartesianGrid,
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
  const weightTicks = Array.from(
    { length: (100 - 40) / 10 + 1 },
    (_, i) => 40 + i * 10,
  );
  const stepsTicks = Array.from({ length: 6 }, (_, i) => i * 2000);

  return (
    <>
      <div className="bg-white w-full rounded-[10px] h-[400px] mb-4">
        <ResponsiveContainer width="100%" height="100%" className="py-10 px-0">
          <ComposedChart
            data={chartData}
            className=""
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              stroke="var(--color-text-3)"
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              width={35}
              tick={{ fontSize: 12 }}
              ticks={weightTicks}
              domain={[40, 100]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={35}
              domain={([min, max]) => [min - 1000, max + 1000]}
              tick={{ fontSize: 12 }}
              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
            />
            <CartesianGrid
              yAxisId="left"
              strokeDasharray="3 3"
              stroke="#ccc"
              vertical={false}
            />
            <Line yAxisId="left" dataKey="weight" stroke="var(--color-textColor)" dot={{ fill: "var(--color-textColor)" }}></Line>
            <Bar yAxisId="right" dataKey="steps" fill="pink"></Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
