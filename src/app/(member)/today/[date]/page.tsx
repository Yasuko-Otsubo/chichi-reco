'use client'

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordResponse } from "@/app/api/records/[id]/route";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  // ===== params / auth ===== 
  const { id } = useParams<{id: string}>();
  const router = useRouter();
  const { token } = useSupabaseSession();

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
    if (!token) return

    const fetcher = async () => {
      const res = await fetch(`/api/records/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      const { record }: RecordResponse = await res.json();
      setRecord(record);
    }

    fetcher()
  }, [token, id])

}