"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Nav: React.FC = () => {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `flex flex-col items-center justify-center pt-2 pb-1 text-sm flex-1 ${
      pathname.startsWith(href)
        ? "text-textColor font-extrabold border-t-2 border-textColor pointer-events-none"
        : "text-textColor"
    }`;
  return (
    <div className="flex w-[90%] xs:w-[80%] bg-white rounded-[15px]">
      <Link href="/today" className={linkClass("/today")}>
        <Image
          src="/pen.png"
          alt="入力ボタン"
          width={30}
          height={30}
          className="mb-2 w-6 h-6 "
        />
        入力
      </Link>
      <Link href="/calendar" className={linkClass("/calendar")}>
        <Image
          src="/calendar.png"
          alt="カレンダー"
          width={30}
          height={30}
          className="mb-2 w-6 h-6"
        />
        カレンダー
      </Link>
      <Link href="/graph" className={linkClass("/graph")}>
        <Image
          src="/graph.png"
          alt="グラフ"
          width={30}
          height={30}
          className="mb-2 w-6 h-6"
        />
        グラフ
      </Link>
      <Link href="/settings" className={linkClass("/settings")}>
        <Image
          src="/setting.png"
          alt="設定"
          width={30}
          height={30}
          className="mb-2 w-6 h-6"
        />
        設定
      </Link>
    </div>
  );
};
