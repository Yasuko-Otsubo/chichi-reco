import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { TodayFormData } from "./TodayForm";

export default function Page() {
  const route = useRouter();
  const { token } = useSupabaseSession();

  const handleCreate = async(data: TodayFormData) => {
    if(!token) {
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
        memo: data.memo ? data.memo: null,
      })
    });

    if(!res.ok) {
      console.log("API error:", data)
      alert("記録に失敗しました");
      return;
    }

    route.replace('/calendar')
    console.log("保存成功")
  }
}