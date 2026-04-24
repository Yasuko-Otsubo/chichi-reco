"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TodayForm } from "../_components/TodayForm";
import {
  CreateRecordRequestBody,
  RecordData,
  RecordResponse,
} from "@/types/record";
import { useForm } from "react-hook-form";
import { TodayFormValues } from "@/types/form";
import { ApiResponse } from "@/types/api";

export default function Page() {
  // ===== auth =====
  const router = useRouter();
  const { token } = useSupabaseSession();

  // ===== URLパラメータから日付を取得 =====
  const { date: paramDate } = useParams<{ date: string }>();
  console.log(paramDate);
  // ===== 規定値を準備 =====
  const today = new Date().toISOString().slice(0, 10);

  const defaultValues = {
    date: paramDate ?? today,
    weight: "",
    steps: "",
    memo: "",
  };

  const { register, handleSubmit, reset, setValue } = useForm<TodayFormValues>({
    defaultValues,
  });

  // ===== 取得データ =====
  const [record, setRecord] = useState<RecordResponse["record"] | null>(null);
  const [prevRecord, setPrevRecord] = useState<RecordData | null>(null);
  const [selectedDate, setSelectedDate] = useState(paramDate ?? today);

  // ===== UI制御 =====
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>(); //setCurrentMonthは前月、次月のときに使用

  // ******* GET *******
  useEffect(() => {
    if (!token) return;

    const fetchPrevRecord = async () => {
      const res = await fetch(`/api/records?before=${selectedDate}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 404) {
        setPrevRecord(null);
        return;
      }

      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      const data: RecordResponse = JSON.parse(text);
      setPrevRecord(data.record ?? null);
    };

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/records/${selectedDate}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 404) {
          //今日のデータがない場合は空
          const emptyRecord: RecordData = {
            id: 0,
            date: selectedDate,
            weight: null,
            steps: null,
            memo: null,
          };
          setRecord(emptyRecord);
          reset({
            date: selectedDate,
            weight: "",
            steps: "",
            memo: "",
          });
          return;
        }

        const text = await res.text();
        if (!text) return;
        const data: RecordResponse = JSON.parse(text);
        if (!data) return;
        if (!data.record) return;

        console.log("API data:", data);

        if (!data.record) return;

        setRecord(data.record);
        reset({
          date: data.record.date.slice(0, 10),
          weight: data.record.weight?.toString() ?? "",
          steps: data.record.steps?.toString() ?? "",
          memo: data.record.memo ?? "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetcher();
    fetchPrevRecord();
  }, [token, paramDate, reset, selectedDate]);

  // ******* POST or PUT *******
  const onSubmit = async (values: TodayFormValues) => {
    if (!token) return;

    if (!values.weight && !values.steps && !values.memo) {
      alert("いづれかの項目を入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      const body: CreateRecordRequestBody = {
        date: values.date,
        weight: values.weight ? Number(values.weight) : null,
        steps: values.steps ? Number(values.steps) : null,
        memo: values.memo || null,
      };

      let res: Response;

      if (!record || record.id === 0) {
        // ******* POST *******
        res = await fetch("/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        // ******* PUT *******
        //差分チェック
        const isSame =
          record.weight === (values.weight ? Number(values.weight) : null) &&
          record.steps === (values.steps ? Number(values.steps) : null) &&
          record.memo === (values.memo || null) &&
          record.date.slice(0, 10) === values.date;

        if (isSame) {
          alert("変更がないため更新しませんでした");
          router.push(`/today/${paramDate}`);
          return;
        }
        //変更があるときだけPUT
        res = await fetch(`/api/records/${selectedDate}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        if (!text) {
          alert("POSTに失敗しました");
          return;
        }
        const errorData = JSON.parse(text) as ApiResponse;
        alert(errorData.message);
        return;
      }

      router.push(`/calendar?month=${currentMonth}`);
      alert("記録しました");
    } catch (error) {
      console.error("記録に失敗しました:", error);
      alert("記録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!token) return;

    if (!confirm("記録を削除しますか？")) return;

    try {
      setIsSubmitting(true);
      await fetch(`/api/records/${paramDate}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("記録を削除しました");

      router.push(`/calendar?month=${currentMonth}`);
    } catch (error) {
      console.error("記録の削除に失敗しました:", error);
      alert("記録の削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TodayForm
      mode={!record || record.id === 0 ? "new" : "edit"}
      register={register}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={handleDelete}
      disabled={isSubmitting || !token}
      prevRecord={prevRecord}
      setValue={setValue}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}
