import Link from "next/link";

export default function IntroPage() {
  return (
    <main>
      <div className="flex flex-col " >
        <Link href={"/support/howto"} className="border p-2 m-2">
          使い方ページ
        </Link>
        <Link href={"/support/faq"} className="border p-2 m-2">
          よくある質問
        </Link>
        <Link href={"/support/contact"} className="border p-2 m-2">
          お問い合わせ
        </Link>
        <Link href={"/support/inquiry"} className="border p-2 m-2">
          利用規約・プライバシーポリシー
        </Link>
      </div>
    </main>
  );
}
