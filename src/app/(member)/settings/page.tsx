"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/app/_libs/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();
  const { session } = useSupabaseSession();

  const isGuest = session?.user.email === process.env.NEXT_PUBLIC_GUEST_EMAIL;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };
  return (
    <main>
      <h1 className="text-xl text-center py-6">設定</h1>
      <div className="flex flex-col bg-white rounded-[15px] py-10 px-6 mb-4">
        {!isGuest && (
          <Link
            href={"/settings/mypage"}
            className="bg-choiceBtn text-center w-[80%] mx-auto p-2 m-2 mb-6 rounded-[10px]"
          >
            マイページ
          </Link>
        )}{" "}
        <Link
          href={"/settings/support"}
          className="bg-choiceBtn text-center w-[80%] mx-auto p-2 m-2 rounded-[10px]"
        >
          サポートページ
        </Link>
        <button
          onClick={handleLogout}
          className="text-center w-[80%] mx-auto p-2 m-2 mt-10 rounded-[10px] text-red-400 border border-red-300 hover:bg-red-400 hover:text-white"
        >
          ログアウト
        </button>
      </div>
    </main>
  );
}
