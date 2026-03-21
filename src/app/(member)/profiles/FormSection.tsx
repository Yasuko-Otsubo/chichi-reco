"use client";

import type { User } from "@supabase/supabase-js";
import React from "react";
import Input from "./Input";

const heightOptions = Array.from({ length: 101 }, (_, i) =>
  (140 + i * 0.5).toFixed(1)
);
const weightOptions = Array.from({ length: 101 }, (_, i) =>
  (50 + i * 0.5).toFixed(1)
);

type Props = {
  name: string;
  height: string;
  targetWeight: string;
  disable: boolean;
  user: User | null;
  onChangeName: (value: string) => void;
  onChangeHeight: (value: string) => void;
  onChangeTargetWeight: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function FormSection({
  name,
  height,
  targetWeight,
  disable,
  user,
  onChangeName,
  onChangeHeight,
  onChangeTargetWeight,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-[400px]">
      <div>
        <Input
          id="name"
          name="name"
          label="名前"
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder="山田　太郎"
          required
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
        <Input
          id="height"
          name="height"
          label="身長"
          type="text"
          inputMode="decimal"
          value={height}
          onChange={onChangeHeight}
          placeholder="例：160"
          required
          disabled={disable}
          list="height-options"
          datalistOptions={heightOptions}
        />
        <Input
          id="targetWeight"
          name="targetWeight"
          label="目標体重"
          type="text"
          inputMode="decimal"
          value={targetWeight}
          onChange={onChangeTargetWeight}
          placeholder="65.5"
          required
          disabled={disable}
          list="targetWeight-options"
          datalistOptions={weightOptions}
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          {disable ? "送信中" : "確認"}
        </button>
      </div>
    </form>
  );
}
