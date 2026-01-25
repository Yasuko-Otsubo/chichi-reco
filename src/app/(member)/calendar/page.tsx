"use client";

import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type Record = {
  date: string;
  weight: number;
  steps: number;
  memo: string;
};

type CalendarCell = {
  date: string;
  day: number;
  weight?: number;
  delta?: number;
};

export default function Page() {

  const router = useRouter();

  ////////////////ここから
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log("ログイン状態:", data.user);

      if (!data.user) {
        router.push("/login");
      }
    });
  }, []);
  /////////////////ここまで最終的にLayout.tsxにまとめる（作業中はページごとに記入）

  //月の開始日と終了日を作る関数
  const getMonthRange = (year: number, month: number) => {
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0 ));

    return {
      startStr: start.toISOString().slice(0, 10)  + "T00:00:00",
      endStr: end.toISOString().slice(0, 10) + "T23:59:59",
    };
  };

  //その月の記録を取得する関数
  const fetchMonthlyRecords = async (year: number, month: number) => {
    const { startStr, endStr } = getMonthRange(year, month);

    //access_token取得
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("access_token:", sessionData.session?.access_token);


    const { data, error } = await supabase
      .from("records")
      .select("*")
      .gte("date", startStr)
      .lte("date", endStr);

    console.log("startStr:", startStr);
    console.log("endStr:", endStr);

    if(error) {
      console.log("Supabase error", error);
      return[];
    }
    return data as Record[];
  };

  //supabaseからの記録をカレンダーに使う準備
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    fetchMonthlyRecords(year, month).then((data) =>{
      console.log("取得した data:", data);

      setRecords(data);
    });
  }, []);
  const recordMap = new Map<string, Record>();

  records.forEach((r) =>{
    recordMap.set(r.date, r);
  });


  return(
    <>
      <div>ここに本文</div>
    </>
  );
}