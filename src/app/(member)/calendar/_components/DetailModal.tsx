import { CalendarCell } from "@/types/calendar";
import { useState } from "react";

type Props = {
  cell: CalendarCell;
  year: number;
  month: number;
  onClose: () => void;
  token: string | null;
  onSave: () => void;
};

export const DetailModal = ({
  cell,
  year,
  month,
  onClose,
  token,
  onSave,
}: Props) => {
  const { day, record } = cell;

  const detailLabel = `${year}年${month}月${day}日`;
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const [weight, setWeight] = useState(record?.weight?.toString() ?? "");
  const [steps, setSteps] = useState(record?.steps?.toString() ?? "");
  const [memo, setMemo] = useState(record?.memo?.toString() ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!token) return;
    if (!weight && !steps) {
      alert("いずれかを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      const body = {
        date: dateString,
        weight: weight ? Number(weight) : null,
        steps: steps ? Number(steps) : null,
        memo: memo || null,
      };

      const method = record && record.id !== 0 ? "PUT" : "POST";
      const url =
        method === "PUT" ? `/api/records/${dateString}` : "/api/records";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("記録に失敗しました");
        return;
      }

      alert("記録しました");
      onSave();
    } catch (error) {
      console.error(error);
      alert("記録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-[600px] mx-auto flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">{detailLabel}</h2>

        <div className="flex justify-between items-center">
          <label>体重</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="w-[120px] border border-bgColor rounded-[10px] px-2 h-9 text-right"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <span>kg</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label>歩数</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="w-[120px] border border-bgColor rounded-[10px] px-2 h-9 text-right"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
            <span>歩</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label>メモ</label>
          <textarea
            className="border border-bgColor rounded-[10px] p-2"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={100}
          />
        </div>

        <button
          className="border border-boxColor bg-decisionBtn rounded-[5px] py-1 cursor-pointer"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          保存する
        </button>
        <button
          className="border border-boxColor bg-decisionBtn rounded-[5px] cursor-pointer"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
