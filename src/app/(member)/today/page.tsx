'use client'

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react"

export default function Page() {
  const [date, setDate] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");

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

    if(!res){
      console.error(data.error);
      return;
    }

    console.log("保存成功", data);
  };
  return(
    <>
      <form>
        <Input
          label="日付"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="体重"
          type="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Input
          label="歩数"
          type="steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          />
        <Input
          label="一言メモ"
          type="memo"
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