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
    // ========== 7days ==========
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

    // ========== 1month ==========
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

    // ========== 6month ==========
    if (range === "6month") {
      const today = new Date();
      const from = new Date(
        today.getFullYear(),
        today.getMonth() - 6,
        today.getDate(),
      );
      const weekCount = Math.ceil(
        (today.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 7),
      );
      const days = Array.from({ length: weekCount }, (_, i) => {
        const d = new Date(from);
        d.setDate(d.getDate() + i * 7);
        d.setHours(0, 0, 0, 0);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      });
      return days.map((day) => {
        const matched = records.filter((r) => {
          const weekEnd = new Date(day);
          weekEnd.setDate(weekEnd.getDate() + 6);
          const d = new Date(r.date);
          return d >= new Date(day) && d <= weekEnd;
        });
        const totalWeight = matched.reduce(
          (acc, cur) => acc + (cur.weight ?? 0),
          0,
        );
        const weightCount = matched.filter((r) => r.weight !== null).length;
        const aveWeight = weightCount === 0 ? null : totalWeight / weightCount;

        const totalSteps = matched.reduce(
          (acc, cur) => acc + (cur.steps ?? 0),
          0,
        );
        const stepsCount = matched.filter((r) => r.steps !== null).length;
        const aveSteps = stepsCount === 0 ? null : totalSteps / stepsCount;
        return {
          id: 0,
          date: day,
          weight: aveWeight,
          steps: aveSteps,
          memo: null,
        };
      });
    }

    // ========== 1year ==========
    if (range === "1year") {
      const months = new Date();
      const from = new Date(
        months.getFullYear(),
        months.getMonth() - 11,
        months.getDate(),
      );
      const monthCount = 12;

      const monthIndex = Array.from({ length: monthCount }, (_, i) => {
        const m = new Date(from);
        m.setMonth(m.getMonth() + i);
        return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-01`;
      });

      return monthIndex.map((month) => {
        const matched = records.filter((r) => {
          return r.date.slice(0, 7) === month.slice(0, 7);
        });

        const totalWeight = matched.reduce(
          (acc, cur) => acc + (cur.weight ?? 0),
          0,
        );
        const weightCount = matched.filter((r) => r.weight !== null).length;
        const aveWeight = weightCount === 0 ? null : totalWeight / weightCount;

        const totalSteps = matched.reduce(
          (acc, cur) => acc + (cur.steps ?? 0),
          0,
        );
        const stepsCount = matched.filter((r) => r.steps !== null).length;
        const aveSteps = stepsCount === 0 ? null : totalSteps / stepsCount;
        return {
          id: 0,
          date: month,
          weight: aveWeight,
          steps: aveSteps,
          memo: null,
        };
      });
    }

    // ========== 3year ==========
    if (range === "3year") {
      const years = new Date();
      const from = new Date(
        years.getFullYear() - 2,
        years.getMonth(),
        years.getDate(),
      );
      const yearsCount = 3;

      const yearIndex = Array.from({ length: yearsCount }, (_, i) => {
        const y = new Date(from);
        y.setFullYear(y.getFullYear() + i);
        return `${y.getFullYear()}`;
      });

      return yearIndex.map((year) => {
        const matched = records.filter((r) => {
          return r.date.slice(0, 4) === year.slice(0, 4);
        });

        const totalWeight = matched.reduce(
          (acc, cur) => acc + (cur.weight ?? 0),
          0,
        );
        const weightCount = matched.filter((r) => r.weight !== null).length;
        const aveWeight = weightCount === 0 ? null : totalWeight / weightCount;

        const totalSteps = matched.reduce(
          (acc, cur) => acc + (cur.steps ?? 0),
          0,
        );
        const stepsCount = matched.filter((r) => r.steps !== null).length;
        const aveSteps = stepsCount === 0 ? null : totalSteps / stepsCount;
        return {
          id: 0,
          date: year,
          weight: aveWeight,
          steps: aveSteps,
          memo: null,
        };
      });
    }
  }, [records, range]);

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
