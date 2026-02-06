'use client'

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import TodayForm, { TodayFormData } from "./[date]/TodayForm";

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()
  console.log("token:", token); 


  const handleCreate = async (data: TodayFormData) => {
    if (!token) {
      alert("ログイン情報がありません");
      return;
    }

    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
      date: data.date,
      weight: Number(data.weight) ? Number(data.weight): null,
      steps: Number(data.steps) ? Number(data.steps): null,
      memo: data.memo,
      })
    });


    if(!res.ok){
      console.log("API error:" , data)
      alert("記録に失敗しました");
      return;
    }

    router.replace('/calendar')

    console.log("保存成功", data);
  };
  const today = new Date().toISOString().slice(0, 10);
  return(
    <>
    <TodayForm initialDate={today} onSubmit={handleCreate} />      
    </>
  )
}