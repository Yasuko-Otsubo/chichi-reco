export default function HowtoPage() {
  const terms = [
    {
      title: "第1条（サービス内容）",
      content: "本アプリは、体重・身長等の記録および管理機能を提供します。",
    },
    {
      title: "第2条（利用者の責任）",
      content:
        "利用者は、自己の責任において本アプリを利用するものとし、登録情報の管理について一切の責任を負います。",
    },
    {
      title: "第3条（禁止事項）",
      content: [
        "利用者は以下の行為を行ってはなりません。",
        "●不正アクセスまたはその試み",
        "●他の利用者または第三者に不利益を与える行為",
        "●本サービスの運営を妨害する行為",
      ],
    },
    {
      title: "第4条（免責事項）",
      content:
        "本アプリは、提供する情報の正確性・完全性を保証するものではありません。また、本アプリは医療行為を目的としたものではなく、健康に関する判断は利用者自身の責任で行うものとします。本アプリの利用により生じた損害について、運営者は一切の責任を負いません。",
    },
        {
      title: "第5条（サービスの変更・停止）",
      content:
        "運営者は、事前の通知なく本サービスの内容を変更または停止することがあります。",
    },
            {
      title: "第6条（規約の変更）",
      content:
        "本規約は、必要に応じて変更されることがあります。",
    },


  ];
  const privacyPolicy = [
    {
      title: "1. 取得する情報",
      content: [
        "●メールアドレス",
        "●体重・身長等の入力データ",
        "●アクセス情報（ログ等）",
      ],
    },
        {
      title: "2. 利用目的",
      content: [
        "●本サービスの提供・運営",
        "●利便性向上・改善",
        "●不正利用の防止",
      ],
    },
    {
      title: "3. 第三者提供",
      content: "取得した情報は、法令に基づく場合を除き、第三者に提供しません。",
    },
    {
      title: "4. 外部サービスの利用",
      content: "本アプリでは、認証およびデータ管理のため外部サービスを利用する場合があります。",
    },
    {
      title: "5. データ管理",
      content: "取得した情報は適切に管理し、漏洩防止に努めます",
    },
    {
      title: "6. 利用者の権利",
      content: "利用者は、自身のデータの確認・修正・削除を行うことができます。",
    },
    {
      title: "7. お問い合わせ",
      content: "本ポリシーに関するお問い合わせは、運営者までご連絡ください。"
    }

  ];
  return (
    <>
      <h1 className="text-xl text-center py-6">使い方</h1>
      <div className=" bg-white rounded-[15px] mb-6 py-4 overflow-y-scroll max-h-[70vh] p-4">
        <div className="mb-10">
          <h4 className="text-base font-semibold mb-4">利用規約</h4>
          <p className="text-sm mb-2">
            本規約は、本サービス（以下「本アプリ」）の利用条件を定めるものです。
          </p>
          {terms.map((term) => (
            <div key={term.title} className="mb-2">
              <h5 className="text-sm font-medium ">{term.title}</h5>
              {Array.isArray(term.content) ? (
                term.content.map((line, i) => (
                  <p key={i} className="text-xs">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-xs mb-4">{term.content}</p>
              )}
            </div>
          ))}
        </div>

        <h4 className="text-base font-semibold mb-4">プライバシーポリシー</h4>
        <p className="text-sm mb-2">
          本アプリは、利用者の個人情報を以下の方針に基づき取り扱います 。
        </p>
        {privacyPolicy.map((privacy) => (
          <div key={privacy.title} className="mb-2">
            <h5 className="text-sm font-medium">{privacy.title}</h5>
            {Array.isArray(privacy.content) ? (
              privacy.content.map((line, i) => (
                <p key={i} className="text-xs">{line}</p>
              ))
            ) : (
              <p className="text-sm mb-2">{privacy.content}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
