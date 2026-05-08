import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  const btnClass =
    "text-xl bg-choiceBtn text-bbb py-4 px-20 rounded-lg transition mb-16 hover:ring-2 hover:ring-inset hover:ring-boxColor";

  const iconLinkClass =
    "pl-4 py-2  flex justify-center items-center flex-col text-xs";

  const subtitles = [
    { title: "✅ 簡単入力", desc: "体重、歩数を入力するだけ" },
    { title: "✅ カレンダーで比較が可能", desc: "前回との差を視覚的に表示" },
    { title: "✅ グラフで変化が見える", desc: "日々の進捗が一目でわかる" },
  ];

  return (
    <main className="flex flex-col items-center justify-center  text-center bg-gradient-to-b">
      <header className="flex justify-between w-full px-6 py-1 items-center">
        <h1 className="text-xl sm:text-2xl">父レコ</h1>
        <div className="flex">
          <Link href="/signup" className={iconLinkClass}>
            <Image
              src="/signup.png"
              alt="新規登録アイコン"
              width={26}
              height={26}
              className="w-5 h-5 sm:w-8 sm:h-8"
            />
            新規登録
          </Link>
          <Link href="/login" className={iconLinkClass}>
            <Image
              src="/login.png"
              alt="ログインアイコン"
              width={26}
              height={26}
              className="w-5 h-5 sm:w-8 sm:h-8"
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
      <h2 className="text-2xl tracking-tight mb-8 text-gray-900 dark:text-white ">
        毎日の健康を簡単記録
      </h2>
      <p className="text-sm  text-gray-700 dark:text-gray-300 max-w-xl mb-10">
        体重や歩数を記録するだけで、グラフで見える！
        今日から始める優しい健康習慣
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/signup" className={btnClass}>
          今すぐ始める
        </Link>
      </div>
      <div className="text-left w-[80%] xs:w-[55%] mb-20">
        {subtitles.map((t) => (
          <div key={t.title}>
            <div className="text-xl sm:text-2xl mb-2">{t.title}</div>
            <p className="text-sm sm:text-base mb-6">{t.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#EAFAFF] w-full py-20 mb-10">
        <div className="mb-20">
          <h3 className="text-xl mb-6">こんなことありませんか？</h3>
          <div>●体重の管理を簡単にしたい</div>
          <div>●一か月の変化を一括で見たい</div>
          <div>●ちょっとしたことをメモしたい</div>
        </div>
        <h3 className="text-xl mb-6">それ父レコで実現できます</h3>
        <div>
          毎日の入力で期間ごとのグラフで自分の体重や運動量を 確認できます！
          <br />
          （登録することで今後オプションも使用できます）
        </div>
        {/*<div>
          <Image
            src="/staff.png"
            width={100}
            height={500}
            alt="スタッフ"
          ></Image>
        </div>
        */}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/signup" className={btnClass}>
          今すぐ始める
        </Link>
      </div>

      <div className=" bg-[#EAFAFF] w-full">
        <div className="flex justify-center gap-6">
          <Link href="/signup" className={iconLinkClass}>
            <Image
              src="/signup.png"
              alt="新規登録アイコン"
              width={26}
              height={26}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            新規登録
          </Link>
          <Link href="/login" className={iconLinkClass}>
            <Image
              src="/login.png"
              alt="ログインアイコン"
              width={26}
              height={26}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            ログイン
          </Link>
        </div>
        <div>instagram</div>
      </div>
    </main>
  );
}