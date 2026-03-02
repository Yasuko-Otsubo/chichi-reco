'use client'

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordData, RecordResponse } from "@/app/api/records/[date]/route";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  // ===== auth ===== 
  const router = useRouter();
  const { token } = useSupabaseSession();

  // ===== URLパラメータから日付を取得 =====
const { date: paramDate } = useParams<{ date: string }>();

  // ===== 表示系・フォーム用 state =====
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");

  // ===== 取得データ =====
  const [record, setRecord] = useState<RecordResponse['record'] | null >(null);

  // ===== UI制御 =====
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ******* GET *******
  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try{
      const res = await fetch(`/api/records/${paramDate}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (res.status === 404) {
        //今日のデータがない場合は空
        const emptyRecord: RecordData = {
        id: 0,
        date: paramDate,
        weight: null,
        steps: null,
        memo: null, 
      };
      setRecord(emptyRecord);
      setDate(emptyRecord.date);
      setWeight("");
      setSteps("");
      setMemo("");
      return;
    }

    const { record }: RecordResponse = await res.json();
    console.log("API record:", record);
    setRecord(record);
    setDate(record.date.slice(0, 10));
    setWeight(record.weight?.toString() ?? "");
    setSteps(record.steps?.toString() ?? "");
    setMemo(record.memo ?? "");
  } catch (error) {
    console.error(error);
  }
};

    fetcher();
  }, [token, paramDate]); 

  return (
    <div>
      <p>date={date}</p>
      <p>weight={weight}</p>
      <p>steps={steps}</p>
      <p>memo={memo}</p>
    </div>
  );
}
