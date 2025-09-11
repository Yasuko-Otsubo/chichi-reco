"use client";

import type { User } from "@supabase/supabase-js";
import React from "react";

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
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          名前
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name"
          required
          onChange={(e) => onChangeName(e.target.value)}
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
          list="height-options"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="例 : 65.5"
          required
          onChange={(e) => onChangeHeight(e.target.value)}
          value={height}
          disabled={disable}
        />
        <datalist id="height-options">
          {Array.from({ length: 61 }, (_, i) => (150 + i * 0.1).toFixed(1)).map(
            (h) => (
              <option key={h} value={h} />
            )
          )}
        </datalist>
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
          list="targetWeight-options"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="例 : 60.5"
          required
          onChange={(e) => onChangeTargetWeight(e.target.value)}
          value={targetWeight}
          disabled={disable}
        />
        <datalist id="targetWeight-options">
          {Array.from({ length: 61 }, (_, i) => (50 + i * 0.1).toFixed(1)).map(
            (h) => (
              <option key={h} value={h} />
            )
          )}
        </datalist>
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
