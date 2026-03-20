"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useEffect, useState } from "react";
//import styles from "@/app/_styles/Calendar.module.css";
import { Calendar } from "./_components/Calendar";
import { RecordData, RecordsResponse } from "@/types/record";

export default function CalendarPage() {
  // ===== auth =====
  const { token } = useSupabaseSession();

  // ===== 取得データ =====
  const [records, setRecords] = useState<RecordData[]>([]);

  // ===== 表示中の月 =====
  const [today] = useState(() => new Date());
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  // ===== 年月計算 =====
  const [year, month] = currentMonth.split("-").map(Number);
  const currentDate = new Date(year, month - 1, 1);

  // 関数化
  const formatMonth = (data: Date) => {
    return (
      `${data.getFullYear()}-` +
      `${String(data.getMonth() + 1).padStart(2, "0")}`
    );
  };
  // ===== 前月計算 =====
  const prevDate = new Date(currentDate);
  prevDate.setMonth(prevDate.getMonth() - 1);

  const prevMonth = formatMonth(prevDate);
  // ===== 月変更処理 =====
  const changeMonth = (diff: number) => {
    const date = new Date(year, month - 1 + diff, 1);

    const newMonth = formatMonth(date);
    setCurrentMonth(newMonth);
  };

  // ===== 今日の日付のハイライト =====
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const fetchWithAuth = async (url: string): Promise<Response> => {
        const res = await fetch(url, {
          headers: { Authorization: token },
        });

        if (!res.ok) {
          throw new Error("API error");
        }

        return res;
      };

      const [res1, res2] = await Promise.all([
        fetchWithAuth(`/api/records?month=${prevMonth}`),
        fetchWithAuth(`/api/records?month=${currentMonth}`),
      ]);

      const [data1, data2] = await Promise.all([
        res1.json().then((d) => d as RecordsResponse),
        res2.json().then((d) => d as RecordsResponse),
      ]);

      //配列結合
      const merged = [...data1.records, ...data2.records];

      //重複削除
      const unique = Array.from(
        new Map(merged.map((r) => [r.date.slice(0, 10), r])).values(),
      );

      setRecords(unique);
    };
    fetcher();
  }, [prevMonth, currentMonth, token]);

  // ===== カレンダー用データ準備 =====
  // ===== レコードを日付順に並べる =====
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // ===== 日付→recordを引けるmap =====
  const recordMap = new Map(sortedRecords.map((r) => [r.date.slice(0, 10), r]));

  // ===== カレンダー日付セルの作成 =====
  // 月の日数
  const daysInMonth = new Date(year, month, 0).getDate();

  // 月初の曜日
  const firstDay = new Date(year, month - 1, 1).getDay();

  // 月初の空白セル
  const blanks = Array(firstDay).fill(null);

  // 月の日付
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // カレンダーセル
  const cells = [...blanks, ...days];

  // 月末の空白セル
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  // ===== 体重差分計算 =====
  const recordIndexMap = new Map(sortedRecords.map((r, i) => [r.id, i]));

  // カレンダー1セルごとの表示データを作る
  const calendarData = cells.map((day) => {
    // 空白セル
    if (day === null) {
      return { day: null, record: null, diff: null };
    }

    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // 日付→record取得
    const record = recordMap.get(dateString) ?? null;

    // ===== 差分計算 =====
    // 差分初期値
    let diff: number | null = null;

    // 前回体重との差分を計算
    if (record && record.weight !== null) {
      const index = recordIndexMap.get(record.id);

      if (index !== undefined) {
        for (let i = index - 1; i >= 0; i--) {
          const prev = sortedRecords[i];

          if (prev.weight !== null) {
            diff = record.weight - prev.weight;
            break;
          }
        }
      }
    }
    return { day, record, diff };
  });
  return (
    <Calendar
      calendarData={calendarData}
      year={year}
      month={month}
      changeMonth={changeMonth}
      todayYear={todayYear}
      todayMonth={todayMonth}
      todayDate={todayDate}
    />
  );
}
