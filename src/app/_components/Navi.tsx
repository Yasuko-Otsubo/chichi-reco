"use client";

import Link from "next/link";
import React from "react";

export const Navi: React.FC = () => {
  return (
    <div className="flex">
      <Link href="/today" className="border-2 p-4">
        入力
      </Link>
      <Link href="/calendar" className="border-2 p-4">
        カレンダー
      </Link>
      <Link href="/graph" className="border-2 p-4">
        グラフ
      </Link>
      <Link href="/settings" className="border-2 p-4">
        設定
      </Link>
    </div>
  );
};
