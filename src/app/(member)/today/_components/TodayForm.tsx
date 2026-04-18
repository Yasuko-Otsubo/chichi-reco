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
      <h1 className="text-xl text-center py-6">今日の記録</h1>
      <div className=" bg-white rounded-[15px] w-[80%] mx-auto mb-10 p-2">
        <div className="text-sm">前回の記録</div>
        <div className="flex justify-center flex-col items-center">
          {prevRecord && (
            <div className="flex justify-center">
              <p className="font-bold m-3 p-2">{prevRecord.weight}kg</p>
              <p className="font-bold m-3 p-2">{prevRecord.steps}歩</p>
            </div>
          )}{" "}
          {/*ここにアコーディオン*/}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ?<>一言メモ <span className="font-bold">{"－"}</span></> : <>一言メモ <span className="font-bold">+</span></>}
          </button>
          {isOpen && prevRecord && (
            <p className="p-2"> {prevRecord.memo}</p>
          )}
        </div>
      </div>
      <div className="flex justify-center bg-white rounded-[15px] w-[80%] mx-auto mb-10 p-2">
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
      </div>
    </>
  );
};
