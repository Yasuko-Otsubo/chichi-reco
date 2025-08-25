import Image from "next/image";

export default function IntroPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Image
        src="/logo.svg"
        alt="父レコのロゴ"
        width={120}
        height={120}
        className="mb-6"
      />
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        家族の健康を、やさしく記録。
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mb-8">
        父レコは、家族の健康記録を安心して続けられるアプリです。<br />
        シンプルで美しいUI、記録しやすいUX、そして守られるプライバシー。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/user/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          はじめてみる
        </a>
        <a
          href="/user/login"
          className="border border-gray-400 hover:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition"
        >
          ログイン
        </a>
      </div>
    </main>
  );
}