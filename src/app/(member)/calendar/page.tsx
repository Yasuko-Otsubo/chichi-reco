"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useEffect, useState } from "react";
//import styles from "@/app/_styles/Calendar.module.css";
import { Calendar } from "./_components/Calendar";
import { RecordData, RecordsResponse } from "@/types/record";
import { CalendarCell } from "@/types/calendar";
import { DetailModal } from "./_components/DetailModal";

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
  // ===== タグ =====
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const tagClass = (v: string) =>
    `py-3 mx-[3px] w-full text-xs ${view === v ? "bg-tagChoice text-white" : "bg-white"}`;

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

  // ===== 日付選択 =====
  const [selectedCell, setSelectedCell] = useState<CalendarCell | null>(null);

  const [refetchFlag, setRefetchFlag] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const fetchWithAuth = async (url: string): Promise<Response> => {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status} / ${url}`);
        }

        return res;
      };

      const [res1, res2] = await Promise.all([
        fetchWithAuth(`/api/records?month=${prevMonth}`),
        fetchWithAuth(`/api/records?month=${currentMonth}`),
      ]);

      const data1: RecordsResponse = await res1.json();
      const data2: RecordsResponse = await res2.json();

      //配列結合
      const merged = [...data1.records, ...data2.records];

      //重複削除
      const unique = Array.from(
        new Map(merged.map((r) => [r.date.slice(0, 10), r])).values(),
      );

      setRecords(unique);
    };
    fetcher();
  }, [prevMonth, currentMonth, token, refetchFlag]);

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
  const blanks: (number | null)[] = Array(firstDay).fill(null);

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
    <>
      <h1 className="text-xl text-center py-4">カレンダー</h1>

      <div className="bg-white text-center py-2 mb-4 rounded-[10px]">
        <button onClick={() => changeMonth(-1)}>＜</button>
        <span className="text-xl font-medium px-8">
          {year}年 {month}月
        </span>
        <button
          onClick={() => changeMonth(1)}
          disabled={year === todayYear && month === todayMonth}
          className={
            year === todayYear && month === todayMonth ? "text-gray-300" : ""
          }
        >
          ＞
        </button>
      </div>
      <div className="flex justify-between text-base mb-4">
        <button
          className={tagClass("calendar")}
          onClick={() => setView("calendar")}
        >
          カレンダー
        </button>
        <button className={tagClass("list")} onClick={() => setView("list")}>
          リスト
        </button>
      </div>

      {view === "calendar" && (
        <Calendar
          calendarData={calendarData}
          year={year}
          month={month}
          todayYear={todayYear}
          todayMonth={todayMonth}
          todayDate={todayDate}
          onDayClick={(cell) => {
            if (today < new Date(year, month - 1, cell.day)) return;
            setSelectedCell(cell);
          }}
        />
      )}

      {view === "list" && (
        <table className="w-full mb-2 [&_th]:p-1 [&_td]:p-2 [&_th]:border-1 [&_td]:border-1 [&_th]:border-t-0 [&_tr>:first-child]:border-l-0 [&_tr>:last-child]:border-r-0">
          <thead>
            <tr>
              <th className="text-sm">日付</th>
              <th className="w-15">体重</th>
              <th className="w-20">歩数</th>
              <th className="">血圧</th>
              <th className="">メモ</th>
            </tr>
          </thead>
          <tbody>
            {calendarData
              .filter((item) => item.day !== null)
              .map((item) => (
                <tr
                  key={item.day}
                  className="bg-white pt-2 text-sm cursor-pointer"
                  onClick={() => {
                    if (today < new Date(year, month - 1, item.day!)) return;
                    setSelectedCell({ day: item.day!, record: item.record });
                  }}
                >
                  <td className="border-1 border-l-0 text-right">{item.day}</td>
                  <td className="border-1">
                    {item.record?.weight != null
                      ? `${item.record.weight}kg`
                      : ""}
                  </td>
                  <td className="border-1 text-right">
                    {item.record?.steps != null ? `${item.record.steps}歩` : ""}
                  </td>
                  <td className="border-1">
                    <div className="min-h-[1.2em]">
                      {item.record?.morningSystolic != null
                        ? `${item.record.morningSystolic}/${item.record?.morningDiastolic}mmHg`
                        : ""}
                    </div>
                    <div className="min-h-[1.2em]">
                      {item.record?.eveningSystolic != null
                        ? `${item.record.eveningSystolic}/${item.record?.eveningDiastolic}mmHg`
                        : ""}
                    </div>
                  </td>
                  <td className="border-1 border-r-0">{item.record?.memo}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {selectedCell && (
        <DetailModal
          cell={selectedCell}
          year={year}
          month={month}
          onClose={() => setSelectedCell(null)}
          token={token}
          onSave={() => {
            setSelectedCell(null);
            setRefetchFlag((prev) => prev + 1);
          }}
        />
      )}
    </>
  );
}
