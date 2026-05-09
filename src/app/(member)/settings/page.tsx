import Link from "next/link";

export default function IntroPage() {
  return (
    <main>
      <h1 className="text-xl text-center py-6">設定</h1>
      <div className="flex flex-col bg-white rounded-[15px] py-10 px-6 mb-4" >
        <Link href={"/settings/mypage"} className="bg-choiceBtn text-center w-[80%] mx-auto p-2 m-2 mb-6 rounded-[10px]">
          マイページ
        </Link>
        <Link href={"/settings/support"} className="bg-choiceBtn text-center w-[80%] mx-auto p-2 m-2 rounded-[10px]">
          サポートページ
        </Link>
      </div>
    </main>
  );
}
