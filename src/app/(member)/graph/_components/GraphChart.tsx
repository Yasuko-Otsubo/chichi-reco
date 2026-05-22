"use client";

import { useWindowWidth } from "@/app/_hooks/useWindowWidth";
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
  const width = useWindowWidth();

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
      const month = date.getMonth() + 1;
      if (width >= 400) return `${month}`;
      return month % 2 === 1 ? `${month}` : "";
    }
    return `${date.getFullYear()}年`;
  };

  //　体重のメモリ計算
  const weights = chartData
    .map((d) => d.weight)
    .filter((w) => w !== null) as number[];
  const minWeight = weights.length > 0 ? Math.min(...weights) : 60;
  const maxWeight = weights.length > 0 ? Math.max(...weights) : 80;

  const weightMin = Math.max(20, Math.floor((minWeight - 10) / 10) * 10);
  const weightMax = Math.min(200, Math.ceil((maxWeight + 10) / 10) * 10);

  const weightRange = weightMax - weightMin;
  const intervalWeight = weightRange <= 60 ? 10 : weightRange <= 90 ? 20 : 30;
  const weightTicks = Array.from(
    { length: (weightMax - weightMin) / intervalWeight + 1 },
    (_, i) => weightMin + i * intervalWeight,
  );

  //　歩数のメモリ計算
  const stepsMemori = chartData
    .map((d) => d.steps)
    .filter((s) => s !== null) as number[];
  //const minSteps = stepsMemori.length > 0 ? Math.min(...stepsMemori) : 0;
  const maxSteps = stepsMemori.length > 0 ? Math.max(...stepsMemori) : 5000;

  const stepsMin = 0;
  const roughMax = Math.min(40000, Math.ceil((maxSteps + 500) / 500) * 500);

  const stepsRange = roughMax - stepsMin;
  const intervalSteps =
    stepsRange <= 5000 ? 1000 : stepsRange <= 10000 ? 3000 : 5000;
  const stepsMax = Math.ceil(roughMax / intervalSteps) * intervalSteps;
  const stepsTicks = Array.from(
    { length: (stepsMax - stepsMin) / intervalSteps + 1 },
    (_, i) => stepsMin + i * intervalSteps,
  );

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
              domain={[weightMin, weightMax]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={35}
              domain={[stepsMin, stepsMax]}
              tick={{ fontSize: 12 }}
              ticks={stepsTicks}
            />
            <CartesianGrid
              yAxisId="left"
              strokeDasharray="3 3"
              stroke="#ccc"
              vertical={false}
            />
            <Line
              yAxisId="left"
              dataKey="weight"
              stroke="var(--color-textColor)"
              dot={{ fill: "var(--color-textColor)" }}
            ></Line>
            <Bar
              yAxisId="right"
              dataKey="steps"
              fill="#E1E1E1"
              stroke="#BABABA"
              strokeWidth={0.3}
            ></Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
