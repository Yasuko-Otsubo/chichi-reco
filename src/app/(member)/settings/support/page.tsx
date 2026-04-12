import Link from "next/link";

export default function IntroPage() {
  return (
    <main>
      <div className="flex flex-col " >
        <Link href={"/settings/support/howto"} className="border p-2 m-2">
          使い方ページ
        </Link>
        <Link href={"/settings/support/faq"} className="border p-2 m-2">
          よくある質問
        </Link>
        <Link href={"/settings/support/contact"} className="border p-2 m-2">
          お問い合わせ
        </Link>
        <Link href={"/settings/support/inquiry"} className="border p-2 m-2">
          利用規約・プライバシーポリシー
        </Link>
      </div>
    </main>
  );
}
