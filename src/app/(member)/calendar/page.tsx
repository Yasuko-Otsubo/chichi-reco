'use client'

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";


type Record = {
  date: string;
  weight: number;
  steps: number;
  memo: string;
}

type CalendarCell = {
  date: string;
  day: number;
  weight?: number;
  delta?: number;
}


export default function Page() {
  //月の開始日と終了日を作る関数
  const getMonthRange = (year: number, month: number) => {
    const start = new Date(year, month, 1); 
    const end = new Date(year, month + 1, 0 );

    return {
      startStr: start.toISOString().slice(0, 10),
      endStr: end.toISOString().slice(0, 10),
    };
  };
    
  //その月の記録を取得する関数
  const fetchMonthlyRecords = async (year: number, month: number) => {
    const { startStr, endStr } = getMonthRange(year, month);

    const { data, error } = await supabase
    .from("records")
    .select("*")
    .gte("date", startStr)
    .lte("date", endStr);

    if(error) {
      console.log("Supabase error", error);
      return[];
    }
    return data as Record[]
};
  
  //supabaseからの記録をカレンダーに使う準備
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    fetchMonthlyRecords(year, month).then((data) =>{
      setRecords(data);
    })
  }, []);
  const recordMap = new Map<string, Record>();

  records.forEach((r) =>{
    recordMap.set(r.date, r);
  });


return(
  <>
  <div>ここに本文</div>
  </>
)
}