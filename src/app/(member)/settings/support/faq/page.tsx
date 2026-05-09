"use client";

import { useState } from "react";

export default function FaqPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const faqs = [
    {
      id: 1,
      question: "身長、目標体重の設定は何かに利用されるのですか？",
      answer:
        "プロフィール設定で身長や体重を設定していただきますと、今後グラフにも連携していく仕様なのでその際はぜひご活用ください。私用目的は致しません",
    },
    {
      id: 2,
      question: "グラフに何も表示されない",
      answer:
        "データをいれていただくと表示されると思います。それでも表示されない場合はお問い合わせにてご連絡ください。対応いたします。",
    },
    {
      id: 3,
      question: "退会したい",
      answer:
        "現在はプロフィール削除はできません。今後作成する予定ですが急ぎの型はお問い合わせにてご連絡ください。",
    },
  ];

  return (
    <>
      <h1 className="text-xl text-center py-6">よくある質問</h1>
      <div className=" bg-white rounded-[15px] mb-6 p-2 py-10 ">
        {faqs.map((faq) => (
          <div key={faq.id} >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-[80%] text-left block mx-auto mb-4 bg-tagChoice border border-[var(--color-boxColor)] p-2 rounded-[5px]"
            >
              {faq.question}
            </button>
            {openId === faq.id && <div className="w-[80%] text-left block mx-auto mb-8 bg-white">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
