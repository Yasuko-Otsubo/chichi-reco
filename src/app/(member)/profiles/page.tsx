"use client";

import { supabase } from "@/utils/supabase";
//import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import FormSection from "./FormSection";

export default function Page() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [confirmMode, setConfirmMode] = useState(false);

  useEffect(() => {
    console.log(user)
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  

  const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmMode(true);
  };

  const handleSubmit = async () => {
    setDisable(true);

    if (!user) {
      alert("ユーザー情報が取得できていません");
      setDisable(false);
      return;
    }
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
        user_id: user?.id, // 認証済みユーザーのID
        name,
        height: Number(height),
        target_weight: Number(targetWeight),
      },
      { onConflict: "user_id" }

    );

      if (error) {
        console.error("認証エラーです：", error.message);
        console.log("user.id:", user?.id);
        alert("登録に失敗しました");
      } else {
        setName("");
        setHeight("");
        setTargetWeight("");
        alert("登録しました");
        setConfirmMode(false);
      }
    } catch (e: unknown) {
      console.error("通信エラー：", e);
      alert("通信エラーが発生しました");
    } finally {
      setDisable(false);
    }
  };
  return (
    <div className="flex justify-center pt-[50px]">
      {confirmMode ? (
        <div className="space-y-4 w-full max-w-[400px]">
          <h2 className="text-lg font-semibold">入力内容の確認</h2>
          <p>名前：{name}</p>
          <p>メールアドレス：{user?.email ?? "未取得"}</p>
          <p>身長：{height} cm</p>
          <p>目標体重：{targetWeight} kg</p>
          <div className="flex gap-4">
            <button
              onClick={() => setConfirmMode(false)}
              className="w-full text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              戻る
            </button>
            <button
              onClick={handleSubmit}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={disable}
            >
              {disable ? "送信中" : "登録"}
            </button>
          </div>
        </div>
      ) : (
        <FormSection
          name={name}
          height={height}
          targetWeight={targetWeight}
          disable={disable}
          user={user}
          onChangeName={setName}
          onChangeHeight={setHeight}
          onChangeTargetWeight={setTargetWeight}
          onSubmit={handleConfirm}
        />
      )}
    </div>
  );
}
