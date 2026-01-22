'use client'

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export default function Page() {
  const router = useRouter()
  const [date, setDate] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");
  const { token } = useSupabaseSession()
  console.log("token:", token); 

  useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);
  setDate(today);
}, []);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) { alert("ログイン情報がありません"); return; }

    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify({
      date,
      weight,
      steps,
      memo,
      profileId: 1
      })
    });

    const data = await res.json();

    if(!res.ok){
      console.log("API error:" , data)
      alert("記録に失敗しました");
      return;
    }

    router.replace('/calendar')

    console.log("保存成功", data);
  };
  return(
    <>
    <div className="min-h-screen flex flex-col items-center justify-start pt-[100px] w-full max-w-[500px] bg-[#a2dae7]  mx-auto ">
      <form onSubmit={handleSubmit} className="bg-white rounded-[50px] p-10 space-y-4 w-full max-w-[400px]">
        <Input
          label="日付"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="体重"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Input
          label="歩数"
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          />
        <Input
          label="一言メモ"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          />
          <Button type="submit">
            記録する
          </Button>
      </form>
      </div>

    </>
  )
}