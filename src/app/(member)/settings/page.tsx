import Link from "next/link";

export default function IntroPage() {
  return (
    <main>
      <div>
        <Link href={"/settings/mypage"} className="border p-2 m-2">マイページ</Link>
        <Link href={"/settings/support"} className="border p-2 m-2">サポートページ</Link>
      </div>
    </main>
  );
}
