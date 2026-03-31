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
        console.log(data.records);
        setRecords(data.records);
      } catch (error) {
        console.error(error);
      }
    };
    fetcher();
  }, [token, range]);

  const chartData = useMemo(() => {
    //  if (range === "7days" || range === "1month") {
    //    return records;
    //  }

    // 先に定義を決める
    let getKey: (date: Date) => string;
    if (range === "7days") {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      });
      return days.map((day) => {
        const record = records.find(
          (r) => r.date.slice(0, 10) === day.slice(0, 10),
        );
        return {
          id: 0,
          date: day,
          weight: record?.weight ?? null,
          steps: record?.steps ?? null,
          memo: null,
        };
      });
    }
    if (range === "1month") {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const monthFrame = new Date(year, month + 1, 0).getDate();

      const days = Array.from({ length: monthFrame }, (_, i) => {
        const d = new Date();
        d.setFullYear(year, month, i + 1);
        d.setHours(0, 0, 0, 0);
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
        return dateStr;
      });
      console.log("days", days);
      console.log("record date sample", records[0]?.date);

      console.log("records", records);

      return days.map((day) => {
        const record = records.find(
          (r) => r.date.slice(0, 10) === day.slice(0, 10),
        );
        console.log(
          "find result",
          days.map((day) => records.find((r) => r.date.slice(0, 10) === day)),
        );

        return {
          id: 0,
          date: day,
          weight: record?.weight ?? null,
          steps: record?.steps ?? null,
          memo: null,
        };
      });
    }

    if (range === "6month") {
      getKey = (date) => {
        const today = new Date();
        const diff = Math.floor(
          // dateはgroupedから渡される
          (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
        // 何週前かを出す
        const weekIndex = Math.floor(diff / 7);
        return String(weekIndex);
      };
    } else if (range === "1year") {
      getKey = (date) => date.toISOString().slice(0, 7);
    } else {
      getKey = (date) => {
        const today = new Date();
        const diff = Math.floor(
          (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
        const quarterIndex = Math.floor(diff / 91);
        return String(quarterIndex);
      };
    }
    // データを週・月・年ごとにまとめる中間処理
    const grouped = records.reduce<Record<string, RecordData[]>>((acc, r) => {
      const key = getKey(new Date(r.date));
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(r);
      return acc;
    }, {});
    //
    return Object.entries(grouped).map(([_, items]) => ({
      id: 0,
      date: items[items.length - 1].date,
      weight: items.reduce((s, r) => s + (r.weight ?? 0), 0) / items.length,
      steps: items.reduce((s, r) => s + (r.steps ?? 0), 0) / items.length,
      memo: null,
    }));
  }, [records, range]);

  const formatTick = (v: string) => {
    console.log("tick", v, new Date(v).getDate());

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
      return `${date.getMonth() + 1}月`;
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
