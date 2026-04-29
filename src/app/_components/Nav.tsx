"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Nav: React.FC = () => {
  return (
    <div className="flex w-[80%] bg-white rounded-[15px]">
      <Link href="/today" className="flex flex-col items-center justify-center pt-2 pb-1 text-sm xs:text-base text-textColor flex-1">
        <Image src="/pen.png" alt="入力ボタン" width={30} height={30} className="mb-2 w-5 h-5 xs:w-7 xs:h-7 sm:w-[30px] sm:h-[30px] " />
        入力
      </Link>
      <Link href="/calendar" className="flex flex-col items-center justify-center pt-2 pb-1 text-xs xs:text-base text-textColor flex-1">
        <Image src="/calendar.png" alt="カレンダー" width={30} height={30} className="mb-2 w-5 h-5 xs:w-7 xs:h-7 sm:w-[30px] sm:h-[30px]" />
        カレンダー
      </Link>
      <Link href="/graph" className="flex flex-col items-center justify-center pt-2 pb-1 text-sm xs:text-base text-textColor flex-1">
        <Image src="/graph.png" alt="グラフ" width={30} height={30} className="mb-2 w-5 h-5 xs:w-7 xs:h-7 sm:w-[30px] sm:h-[30px]" />
        グラフ
      </Link>
      <Link href="/settings" className="flex flex-col items-center justify-center pt-2 pb-1 text-textColor flex-1">
        <Image src="/setting.png" alt="設定" width={30} height={30} className="mb-2 w-5 h-5 xs:w-7 xs:h-7 sm:w-[30px] sm:h-[30px]"/>
        設定
      </Link>
    </div>
  );
};
