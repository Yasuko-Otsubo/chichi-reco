'use client'

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"
import React, { useState } from "react"
import { RecordData } from "@/types/records";

export type TodayFormData = {
  date: string;
  weight: string | null;
  steps: string | null;
  memo: string | null;
}

type TodayFormProps = {
  defaultValues: TodayFormData;
  isEdit: boolean;
  recordId: string | null;
  prevRecord: RecordData | null;
}

export default function TodayForm({
  defaultValues, isEdit, recordId, prevRecord,
}: TodayFormProps ) {
  const [date, setDate] = useState(defaultValues.date);
  const [weight, setWeight] = useState(defaultValues.weight ?? "");
  const [steps, setSteps] = useState(defaultValues.steps ?? "");
  const [memo, setMemo] = useState(defaultValues.memo ?? "");
  void recordId;
  void prevRecord;
  
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            {isEdit ? "更新する": "記録する"}
          </Button>
      </form>
    </div>
    </>
  )
} 