import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center  text-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 ">
      <header className="flex justify-between w-full">
        <h1>父レコ</h1>
        <div className="mb-2">
          <Link href="/signup" className="p-2 border border border-solid mr-[2px]">新規登録</Link>
          <Link href="/login" className="p-2 border border border-solid mr-[2px]">ログイン</Link>

        </div>
      </header>

      <Image
        src="/top-hero-bg.png"
        alt="父レコのロゴ"
        width={600}
        height={400}
        className="w-full max-w-[500px] h-auto object-contain bg-[#e6f7ff]"
      />
      <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        家族の健康を、やさしく記録。
      </h2>
      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mb-8">
        父レコは、家族の健康記録を安心して続けられるアプリです。
        <br />
        シンプルで美しいUI、記録しやすいUX、そして守られるプライバシー。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          はじめてみる
        </Link>
      </div>
    </main>
  );
}
