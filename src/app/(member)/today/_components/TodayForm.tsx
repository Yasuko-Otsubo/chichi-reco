import { TodayFormValues } from "@/types/form";
import { RecordData } from "@/types/record";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  mode: "new" | "edit";

  register: UseFormRegister<TodayFormValues>;

  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onDelete?: () => void;
  disabled: boolean;
  prevRecord: RecordData | null;
}

export const TodayForm: React.FC<Props> = ({
  mode,
  register,
  onSubmit,
  onDelete,
  disabled,
  prevRecord,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {prevRecord && (
        <div className="flex justify-center">
          <p className="border-2 m-3 p-2">体重: {prevRecord.weight}kg</p>
          <p className="border-2 m-3 p-2">歩数: {prevRecord.steps}歩</p>
          {/*ここにアコーディオン*/}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "-": "メモ +"}
          </button>
          {isOpen && (
            <p className="border-2 p-2">メモ: {prevRecord.memo}</p>
          )}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div>
          <label>日付</label>
          <input className="border-2" type="text" {...register("date")} />
        </div>
        <div>
          <label>体重</label>
          <input className="border-2" {...register("weight")} />
        </div>
        <div>
          <label>歩数</label>
          <input className="border-2" {...register("steps")} />
        </div>
        <div>
          <label>一言メモ</label>
          <input className="border-2" {...register("memo")} />
        </div>
        <button type="submit" disabled={disabled}>
          {mode === "new" ? "記録する" : "更新する"}
        </button>
        {mode === "edit" && onDelete && (
          <button type="button" onClick={onDelete} disabled={disabled}>
            削除
          </button>
        )}
      </form>
    </>
  );
};
