'use client'

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"
import React, { useState } from "react"

export type TodayFormData = {
  date: string;
  weight: string;
  steps: string;
  memo: string;
}

type TodayFormProps = {
    initialDate?: string; 
    onSubmit: (data: TodayFormData) => void;
}

export default function TodayForm(
  { initialDate, onSubmit }: TodayFormProps ) {
  const [date, setDate] = useState(initialDate ?? "");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");
  
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({ date, weight, steps, memo });

  }

  return (
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