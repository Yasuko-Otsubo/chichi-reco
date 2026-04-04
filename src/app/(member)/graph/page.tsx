"use client";

import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useGraphData } from "./_hooks/useGraphData";

export default function GraphPage() {
  // ===== 取得データ =====
  const { chartData, range, setRange} = useGraphData();
  

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
    <>
      <div className="h-full%">
        <div className="flex justify-center">
          <button
            className="border-2 p-px mx-[3px]"
            onClick={() => setRange("7days")}
          >
            週
          </button>
          <button
            className="border-2 p-px mx-[3px]"
            onClick={() => setRange("1month")}
          >
            月
          </button>
          <button
            className="border-2 p-px mx-[3px]"
            onClick={() => setRange("6month")}
          >
            6か月
          </button>
          <button
            className="border-2 p-px mx-[3px]"
            onClick={() => setRange("1year")}
          >
            年
          </button>
          <button
            className="border-2 p-px mx-[3px]"
            onClick={() => setRange("3year")}
          >
            全期間
            <br />
            （最大3年）
          </button>
          {/*UXの時に<br>→<span>で処理 */}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              stroke="var(--color-text-3)"
              interval={0}
            />
            <YAxis yAxisId="left" domain={[50, 70]} />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={["auto", "auto"]}
            />
            <Line yAxisId="left" dataKey="weight"></Line>
            <Bar yAxisId="right" dataKey="steps" fill="pink"></Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
