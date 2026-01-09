'use client'

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react"


export default function Page() {
  const [date, setDate] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);
  setDate(today);
}, []);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      date,
      weight,
      steps,
      memo
      })
    });

    const data = await res.json();

    if(!res.ok){
      console.error(data.error);
      return;
    }

    console.log("保存成功", data);
  };
  return(
    <>
      <form onSubmit={handleSubmit}>
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

    </>
  )
}