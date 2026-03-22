"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RecordData, RecordsResponse } from "@/types/record";
import { useEffect, useState } from "react";

export default function GraphPage() {
  const { token } = useSupabaseSession();

  // ===== 取得データ =====
  const [range, setRange] = useState("7days");
  const [records, setRecords] = useState<RecordData[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/records?range=${range}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!res.ok) {
          throw new Error("API error");
        }
        const data: RecordsResponse = await res.json();
        setRecords(data.records);
      } catch (error) {
        console.error(error);
      }
    };
    fetcher();
  }, [token, range]);
  return (
  <></>
)
}
