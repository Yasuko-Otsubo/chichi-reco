"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Nav: React.FC = () => {
  return (
    <div className="flex w-[80%] bg-white rounded-[15px]">
      <Link href="/today" className="flex flex-col items-center justify-center pt-2 pb-2 text-textColor flex-1">
        <Image src="/pen.png" alt="入力ボタン" width={30} height={30} className="mb-2" />
        入力
      </Link>
      <Link href="/calendar" className="flex flex-col items-center justify-center pt-2 pb-2 text-textColor flex-1">
        <Image src="/calendar.png" alt="入力ボタン" width={30} height={30} className="mb-2" />
        カレンダー
      </Link>
      <Link href="/graph" className="flex flex-col items-center justify-center pt-2 pb-2 text-textColor flex-1">
        <Image src="/graph.png" alt="入力ボタン" width={30} height={30} className="mb-2" />
        グラフ
      </Link>
      <Link href="/settings" className="flex flex-col items-center justify-center pt-2 pb-2 text-textColor flex-1">
        <Image src="/setting.png" alt="入力ボタン" width={30} height={30} className="mb-2"/>
        設定
      </Link>
    </div>
  );
};
