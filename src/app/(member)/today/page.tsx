import { redirect } from "next/navigation";

export default function Page() {
  const today = new Date();
  // ===== 今日の日付を日本時間で取得 =====
  const paramDate = `${today.getFullYear()}-${(today.getMonth()+1).toString()
    .padStart(2,'0')}-${today.getDate().toString().padStart(2, '0')}`;

  redirect(`/today/${paramDate}`);
}