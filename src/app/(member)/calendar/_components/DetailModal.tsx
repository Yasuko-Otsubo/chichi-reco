"use client";

import { CalendarCell } from "@/types/calendar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  cell: CalendarCell;
  year: number;
  month: number;
  onClose: () => void;
  token: string | null;
  onSave: () => void;
};

type DefaultValues = {
  weight: string;
  steps: string;
  memo: string;
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

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DefaultValues>({
    defaultValues: {
      weight: record?.weight?.toString() ?? "",
      steps: record?.steps?.toString() ?? "",
      memo: record?.memo ?? "",
    }
  });

  const detailLabel = `${year}年${month}月${day}日`;
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


  const handleSave = handleSubmit(async (values) => {
    if (!token) return;
    if (!values.weight && !values.steps) {
      toast.error("体重または歩数を入力してください");
      return;
  }

    try {
      const body = {
        date: dateString,
        weight: values.weight ? Number(values.weight) : null,
        steps: values.steps ? Number(values.steps) : null,
        memo: values.memo || null,
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
        toast.error("記録に失敗しました");
        return;
      }

      toast.success("記録しました");
      onSave();
    } catch (error) {
      console.error(error);
      toast.error("記録に失敗しました");
    } 
  });

  //delete
  const handleDelete = async () => {
    if (!token) return;
    if (!record || record.id === 0) {
      toast.error("削除する記録がありません");
      return;
    }
    if (!confirm("削除しますか？")) return;

    try {
      const res = await fetch(`/api/records/${dateString}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("削除に失敗しました");
        return;
      }

      toast.success("削除しました");
      onSave();
    } catch (error) {
      console.error(error);
      toast.error("削除に失敗しました");
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
              {...register("weight")}
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
              {...register("steps")}
            />
            <span>歩</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label>メモ</label>
          <textarea
            className="border border-bgColor rounded-[10px] p-2"
            {...register("memo")}
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
        {record && record.id !== 0 && (
          <button
            className="rounded-[5px] py-1 cursor-pointer text-red-400 border border-red-300 hover:bg-red-400 hover:text-white"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            削除する
          </button>
        )}
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
