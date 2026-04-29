import Image from "next/image";

export default function HowtoPage() {
  return (
    <>
      <h1 className="text-xl text-center py-6">使い方</h1>
      <div className=" bg-white rounded-[15px] mb-6 py-4 overflow-y-scroll max-h-[70vh]">
        <h2 className="text-center text-sm xs:text-xl">◆毎日の記録ページ◆</h2>
        <div>
          <Image
            src="/howto.png"
            alt="使い方1"
            width={300}
            height={200}
            className="w-100 h-60 mb-4 xs:w-120 xs:h-100"
          />
        </div>
        <h2 className="text-center text-sm xs:text-xl mb-4">
          ◆アイコンの説明◆
        </h2>
        <Image
          src="/howto-icon.png"
          alt="使い方1"
          width={250}
          height={50}
          className="mx-auto mb-4"
        />
        <div className="text-xs w-[80%] mx-auto mb-10">
          <p className="mb-2">
            ●全てのページ下部に上記のアイコンを表示しています
          </p>
          <p className="mb-2">●入力・・・毎日の記録ページが表示されます</p>
          <p className="mb-2">
            ●カレンダー・・・一か月ごとのカレンダーが表示されます
          </p>
          <p className="mb-2">
            ●グラフ・・・体重と歩数が同じグラフに表示されます
          </p>
          <p className="mb-2">
            ●設定・・・マイページやサポートページのアイコンが表示されます。
            自分の情報や使い方がわからない方はこちらを参照ください
          </p>
        </div>
        <h2 className="text-center text-sm xs:text-xl mb-4">
          ◆カレンダーの説明◆
        </h2>
        <Image
          src="/howto-calendar.png"
          alt="使い方1"
          width={330}
          height={200}
          className="w-100 h-60 mb-4 xs:w-120 xs:h-100"
        />
        <h2 className="text-center text-sm xs:text-xl mb-4">◆グラフの説明◆</h2>
        <Image
          src="/howto-graph.png"
          alt="使い方1"
          width={330}
          height={200}
          className="w-100 h-60 mb-4 xs:w-120 xs:h-100"
        />
      </div>
    </>
  );
}
