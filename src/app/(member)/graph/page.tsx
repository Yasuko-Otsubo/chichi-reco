"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordData, RecordsResponse } from "@/types/record";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function GraphPage() {
  const { token } = useSupabaseSession();

  // ===== 取得データ =====
  const [range, setRange] = useState("7days");
  const [records, setRecords] = useState<RecordData[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/records?range=${range}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!res.ok) {
          throw new Error("API error");
        }
        const data: RecordsResponse = await res.json();
        setRecords(data.records);
      } catch (error) {
        console.error(error);
      }
    };
    fetcher();
  }, [token, range]);

  const chartData = useMemo(() => {
    if (range === "7days" || range === "1month") {
      return records;
    }
    let getKey: (date: Date) => string;
    


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
          <ComposedChart data={records}>
            <XAxis
              dataKey="date"
              tickFormatter={(v) => v.slice(0, 10)}
              stroke="var(--color-text-3)"
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
