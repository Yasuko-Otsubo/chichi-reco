import Link from "next/link";

export default function IntroPage() {
  const linkClass = "bg-choiceBtn text-center w-[80%] mx-auto p-2 m-2 mb-6 rounded-[10px]"
  return (
    <main>
            <h1 className="text-xl text-center py-6">サポート</h1>

      <div className="flex flex-col bg-white rounded-[15px] py-10 px-6 mb-4" >
        <Link href={"/settings/support/howto"} className={linkClass}>
          使い方ページ
        </Link>
        <Link href={"/settings/support/faq"} className={linkClass}>
          よくある質問
        </Link>
        <Link href={"/settings/support/contact"} className={linkClass}>
          お問い合わせ
        </Link>
        <Link href={"/settings/support/inquiry"} className={linkClass}>
          利用規約・プライバシーポリシー
        </Link>
      </div>
    </main>
  );
}
