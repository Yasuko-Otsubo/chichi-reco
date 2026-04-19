"use client";

import { useGraphData } from "./_hooks/useGraphData";
import { GraphChart } from "./_components/GraphChart";

export default function GraphPage() {
  // ===== 取得データ =====
  const { chartData, range, setRange } = useGraphData();

  const tagClass = (r: string) =>
    `py-1 mx-[3px] w-full shadow-[0_6px_4px_-2px_rgba(0,0,0,0.2)] transition-all active:translate-y-0.5 active:shadow-none ${range === r ? "bg-tagChoice text-white" : "bg-white"}`;

  return (
    <>
      <h1 className="text-xl text-center py-6">グラフ</h1>
      <div className="w-full ">
        <div className="flex justify-between text-base mb-6">
          <button
            className={tagClass("7days")}
            onClick={() => setRange("7days")}
          >
            週
          </button>
          <button
            className={tagClass("1month")}
            onClick={() => setRange("1month")}
          >
            月
          </button>
          <button
            className={tagClass("6month")}
            onClick={() => setRange("6month")}
          >
            6か月
          </button>
          <button
            className={tagClass("1year")}
            onClick={() => setRange("1year")}
          >
            年
          </button>
          <button
            className={tagClass("3year")}
            onClick={() => setRange("3year")}
          >
            全期間
            <br />
            <span className="text-xs">（最大3年）</span>
          </button>
          {/*UXの時に<br>→<span>で処理 */}
        </div>
      </div>
      <GraphChart chartData={chartData ?? []} range={range} />
    </>
  );
}
