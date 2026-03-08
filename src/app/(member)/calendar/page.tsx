'use client'

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordData } from "@/app/api/records/[date]/route";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  // ===== auth =====
  const router = useRouter();
  const { token } = useSupabaseSession();

  // ===== 取得データ =====
  const [records, setRecords] = useState<RecordData[]>([]);

  // ===== カレンダーで表示する今月 =====
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);


  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
        const res = await fetch(`/api/records?month=${currentMonth}`, {
          headers: {
            Authorization: token,
          },
        })

        const { records } = await res.json();
        setRecords(records);
      }
      fetcher();
  }, [currentMonth, token])

  // ===== ここからカレンダー計算 =====
  // ===== 年と月 =====
  const [year, month] = currentMonth.split("-").map(Number);

  // ===== 月の日数 =====
  const daysInMonth = new Date(year, month, 0).getDate();

  // ===== 月初の曜日 =====
  const firstDay = new Date(year, month -1, 1).getDay();

  // ===== 最初の空白 =====
  const blanks  = Array(firstDay).fill(null);

  // ===== 最初の日付 =====
  const days = Array.from({ length: daysInMonth },(_, i) => i +1);

  // ===== カレンダーセル =====
  const cells = [...blanks, ...days];

  while (cells.length % 7 ! == 0 ){
    cells.push(null);
  }
  return (
    <pre>{JSON.stringify(records, null, 2)}</pre>
  )
  
}