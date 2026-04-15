import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="flex flex-col items-center justify-center  text-center bg-gradient-to-b">
      <header className="flex justify-between w-full px-2 items-center">
        <h1 className="text-2xl">父レコ</h1>
        <div className="flex">
          <Link
            href="/signup"
            className="pl-4 py-2  flex justify-center items-center flex-col"
          >
            <Image
              src="/signup.png"
              alt="新規登録アイコン"
              width={30}
              height={30}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            新規登録
          </Link>
          <Link
            href="/login"
            className="pl-4 flex justify-center items-center mr-[2px] flex-col"
          >
            <Image
              src="/login.png"
              alt="ログインアイコン"
              width={30}
              height={30}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            ログイン
          </Link>
        </div>
      </header>
      <div className="w-full aspect-[3/2] relative mb-8">
        <Image
          src="/top-hero-bg.png"
          alt="父レコのロゴ"
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-xl sm:text-5xl tracking-tight mb-4 text-gray-900 dark:text-white">
        毎日の健康を簡単記録
      </h2>
      <p className="text-sm sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mb-8">
        体重や歩数を記録するだけで、グラフで見える！<br />
        今日から始める優しい健康習慣 <br />
        シンプルで美しいUI、記録しやすいUX、そして守られるプライバシー。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-12 rounded-lg transition"
        >
          今すぐ始める
        </Link>
      </div>
    </main>
  );
}
