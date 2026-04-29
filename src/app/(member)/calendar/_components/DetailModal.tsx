import { CalendarCell } from "@/types/calendar";

type Props = {
  cell: CalendarCell;
  year: number;
  month: number;
  onClose: () => void;
};

export const DetailModal = ({ cell, year, month, onClose }: Props) => {
  const { day, record } = cell;

  const detailLabel = `${year}年${month}月${day}日`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-[90%] xs:w-[70%] flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{detailLabel}</h2>

        {record ? (
          <>
            <p>体重：{record.weight ?? ""}kg</p>
            <p>歩数：{record.steps ?? ""}歩</p>
            <p>メモ：{record.memo ?? ""}</p>
          </>
        ) : (
          <p>この日は記録がありません</p>
        )}

        <button className="border  border-boxColor bg-decisionBtn  rounded-[5px]" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};
