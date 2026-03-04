"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordData, RecordResponse } from "@/app/api/records/[date]/route";
//import { CreateRecordRequestBody } from "@/app/api/records/route";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const [record, setRecord] = useState<RecordResponse["record"] | null>(null);

  // ===== UI制御 =====
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ******* GET *******
  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/records/${paramDate}`, {
          headers: {
            "Content-Type": "application/json",
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

        const data = await res.json();
        console.log("API data:", data);

        if (!data.record) return;

        setRecord(data.record);
        setDate(data.record.date.slice(0, 10));
        setWeight(data.record.weight?.toString() ?? "");
        setSteps(data.record.steps?.toString() ?? "");
        setMemo(data.record.memo ?? "");
      } catch (error) {
        console.error(error);
      }
    };

    fetcher();
  }, [token, paramDate]);

  // ******* POST or PUT *******
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      setIsSubmitting(true);

      const body = {
        date: date,
        weight: weight ? Number(weight) : null,
        steps: steps ? Number(steps) : null,
        memo: memo || null,
      };

      let res: Response;

      if (!record || record.id === 0) {
        // ******* POST *******
        res = await fetch("/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(body),
        });
      } else {
        // ******* PUT *******
        //差分チェック
        const isSame =
          record.weight === (weight ? Number(weight) : null) &&
          record.steps === (steps ? Number(steps) : null) &&
          record.memo === (memo || null) &&
          record.date.slice(0, 10) === date;

        if (isSame) {
          alert("変更がないため更新しませんでした");
          router.push(`/today/${paramDate}`);
          return;
        }
        //変更があるときだけPUT
        res = await fetch(`/api/records/${paramDate}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "POSTに失敗しました");
      }

      router.push("/today/calendar");
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
          Authorization: token,
        },
      });

      alert("記録を削除しました");

      router.push(`/today/calendar`);
    } catch (error) {
      console.error("記録の削除に失敗しました:", error);
      alert("記録の削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>日付</label>
        <input className="border-2" type="text" value={date} readOnly />
      </div>
      <div>
        <label>体重</label>
        <input
          className="border-2"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div>
        <label>歩数</label>
        <input
          className="border-2"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
      </div>
      <div>
        <label>一言メモ</label>
        <input
          className="border-2"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {!record || record.id === 0 ? "記録する" : "更新する"}
      </button>
      {record && record.id !== 0 && (
        <button type="button" onClick={handleDelete} disabled={isSubmitting}>
          削除
        </button>
      )}
    </form>
  );
}
