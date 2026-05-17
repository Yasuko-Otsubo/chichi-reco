"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "./_libs/supabase";
import toast from "react-hot-toast";

export default function IntroPage() {
  const router = useRouter();

  const btnClass =
    "text-base bg-choiceBtn text-bbb py-2 px-15 rounded-lg cursor-pointer transition mb-6 hover:ring-2 hover:ring-inset hover:ring-boxColor";


  const iconLinkClass =
    "pl-4 py-2  flex justify-center items-center flex-col text-xs";

  const subtitles = [
    { title: "✅ 簡単入力", desc: "体重、歩数を入力するだけ" },
    { title: "✅ カレンダーで比較が可能", desc: "前回との差を視覚的に表示" },
    { title: "✅ グラフで変化が見える", desc: "日々の進捗が一目でわかる" },
  ];

  const handleGuestLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_GUEST_EMAIL!,
      password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
    });

    if (error) {
      toast.error("ゲストログインに失敗しました");
      return;
    }
    router.replace("/today");
  };

  return (
    <main className="flex flex-col items-center justify-center  text-center max-w-xl mx-auto">
      <header className="flex justify-between w-full px-6 py-1 items-center">
        <h1 className="text-xl">父レコ</h1>
        <div className="flex">
          <Link href="/signup" className={iconLinkClass}>
            <Image
              src="/signup.png"
              alt="新規登録アイコン"
              width={26}
              height={26}
              className="w-5 h-5"
            />
            新規登録
          </Link>
          <Link href="/login" className={iconLinkClass}>
            <Image
              src="/login.png"
              alt="ログインアイコン"
              width={26}
              height={26}
              className="w-5 h-5"
            />
            ログイン
          </Link>
        </div>
      </header>

      <div className="w-full aspect-[3/2] relative mb-4">
        <Image
          src="/top-hero-bg.png"
          alt="父レコのロゴ"
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-xl tracking-tight mb-6 text-gray-900 dark:text-white ">
        毎日の健康を簡単記録
      </h2>
      <p className="text-sm  text-gray-700 dark:text-gray-300 max-w-xl mb-5">
        体重や歩数を記録するだけで、グラフで見える！
        <br />
        今日から始める優しい健康習慣
      </p>
      <div className="flex flex-col items-center mb-10">
        <Link href="/signup" className={btnClass}>
          新規登録して始める
        </Link>
        <button onClick={handleGuestLogin} className={btnClass}>
          ゲストで試してみる
        </button>
      </div>
      <div className="text-left w-[80%] xs:w-[70%] mb-20">
        {subtitles.map((t) => (
          <div key={t.title}>
            <div className="text-xl  mb-2">{t.title}</div>
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
          新規登録して始める
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
              className="w-6 h-6"
            />
            新規登録
          </Link>
          <Link href="/login" className={iconLinkClass}>
            <Image
              src="/login.png"
              alt="ログインアイコン"
              width={26}
              height={26}
              className="w-6 h-6"
            />
            ログイン
          </Link>
        </div>
        <div>instagram</div>
      </div>
    </main>
  );
}
