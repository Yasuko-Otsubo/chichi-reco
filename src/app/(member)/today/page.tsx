import { redirect } from "next/navigation";

export default function Page() {
  // ===== 今日の日付を日本時間で取得 =====
  const paramDate = new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-");

  redirect(`/today/${paramDate}`);
}
