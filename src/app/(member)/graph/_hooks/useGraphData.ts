import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordData, RecordsResponse } from "@/types/record";
import { useEffect, useMemo, useState } from "react";

export const useGraphData = () => {
  const { token } = useSupabaseSession();

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

  // 6month, 1year, 3yearの平均関数
  const calcAverage = (matched: RecordData[]) => {
    const totalWeight = matched.reduce(
      (acc, cur) => acc + (cur.weight ?? 0),
      0,
    );
    const weightCount = matched.filter((r) => r.weight !== null).length;
    const aveWeight = weightCount === 0 ? null : totalWeight / weightCount;

    const totalSteps = matched.reduce((acc, cur) => acc + (cur.steps ?? 0), 0);
    const stepsCount = matched.filter((r) => r.steps !== null).length;
    const aveSteps = stepsCount === 0 ? null : totalSteps / stepsCount;
    return { aveWeight, aveSteps };
  };

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

        const { aveWeight, aveSteps } = calcAverage(matched);
        return {
          id: 0,
          date: day,
          weight: aveWeight,
          steps: aveSteps,
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

        const { aveWeight, aveSteps } = calcAverage(matched);
        return {
          id: 0,
          date: month,
          weight: aveWeight,
          steps: aveSteps,
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

        const { aveWeight, aveSteps } = calcAverage(matched);
        return {
          id: 0,
          date: year,
          weight: aveWeight,
          steps: aveSteps,
        };
      });
    }
  }, [records, range]);
  return {
    chartData,
    range,
    setRange,
  };
};
