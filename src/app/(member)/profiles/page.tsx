"use client";

import { supabase } from "@/utils/supabase";
//import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export default function Page() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisable(true);

    if (!user) {
      alert("ユーザー情報が取得できていません");
      setDisable(false);
      return;
    }

    try {
      const { error } = await supabase.from("profiles").upsert({
        name,
        height,
        target_weight: targetWeight,
        user_id: user?.id, // 認証済みユーザーのID
      });

      if (error) {
        console.error("認証エラーです：", error.message);
        alert("登録に失敗しました");
      } else {
        setName("");
        setHeight("");
        setTargetWeight("");
        alert("登録しました");
      }
    } catch (e: unknown) {
      console.error("通信エラー：", e);
      alert("通信エラーが発生しました");
    } finally {
      setDisable(false);
    }
  };
  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            名前
          </label>
          <input
            type="name"
            name="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            disabled={disable}
          />
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {user?.email ?? "未取得"}
          </div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            ・・・・・・・
          </div>
          <label
            htmlFor="height"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            身長
          </label>
          <input
            type="number"
            name="height"
            id="height"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="height"
            required
            onChange={(e) => setHeight(e.target.value)}
            value={height}
            disabled={disable}
          />

          <label
            htmlFor="targetWeight"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            目標体重
          </label>
          <input
            type="number"
            name="targetWeight"
            id="targetWeight"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="targetWeight"
            required
            onChange={(e) => setTargetWeight(e.target.value)}
            value={targetWeight}
            disabled={disable}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {disable ? "送信中" : "登録"}
          </button>
        </div>
      </form>
    </div>
  );
}
