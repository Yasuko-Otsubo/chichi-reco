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
  setValue: (name: "date", value: string) => void;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

export const TodayForm: React.FC<Props> = ({
  mode,
  register,
  onSubmit,
  onDelete,
  disabled,
  prevRecord,
  setValue,
  selectedDate,
  setSelectedDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <h1 className="text-xl text-center py-6">今日の記録</h1>
      <div className=" bg-white rounded-[15px] w-[80%] mx-auto mb-6 p-2">
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
            {isOpen ? (
              <>
                一言メモ <span className="font-bold">{"－"}</span>
              </>
            ) : (
              <>
                一言メモ <span className="font-bold">+</span>
              </>
            )}
          </button>
          {isOpen && prevRecord && <p className="p-2"> {prevRecord.memo}</p>}
        </div>
      </div>
      <div className="flex justify-center bg-white rounded-[15px] w-[80%] mx-auto mb-6 p-2">
        <form onSubmit={onSubmit} className="w-full text-center">
          <div className="w-[80%] mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  /*前日に移動*/
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split("T")[0]);
                  setValue("date", d.toISOString().split("T")[0]);
                }}
              >
                ＜
              </button>
              <input
                className="border border-gray-500 py-2 px-6 rounded-[15px] m-6"
                type="date"
                max={today}
                {...register("date")}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  register("date").onChange(e);
                }}
              />{" "}
              <button
                type="button"
                onClick={() => {
                  /*翌日に移動*/
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split("T")[0]);
                  setValue("date", d.toISOString().split("T")[0]);
                }}
                disabled={selectedDate >= today}
                className={selectedDate >= today ? "text-gray-300" : ""}
              >
                ＞
              </button>
            </div>
            <div className="flex justify-between items-center py-1">
              <label>体重</label>
              <div className="flex items-center">
                <input
                  className="text-right border border-[var(--color-bgColor)] rounded-[10px] h-10  px-4"
                  {...register("weight")}
                />
                <span className="text-bbb ml-2 w-6">Kg</span>
              </div>
            </div>
            <div className="flex justify-between items-center h-10 py-1">
              <label>歩数</label>
              <div className="flex items-center">
                <input
                  className="text-right border border-[var(--color-bgColor)] rounded-[10px] h-10 px-4"
                  {...register("steps")}
                />
                <span className="text-bbb ml-2 w-6">歩</span>
              </div>
            </div>
            <div className="text-left flex flex-col pt-1 mb-8">
              <label className="mb-2">一言メモ</label>
              <textarea
                className="border border-[var(--color-bgColor)] rounded-[10px] p-2"
                {...register("memo")}
              />
            </div>
            <div
              className={`flex justify-center ${mode === "edit" && onDelete ? "gap-2" : ""}`}
            >
              <button
                type="submit"
                disabled={disabled}
                className="hover:bg-[var(--color-bgColor)] bg-decisionBtn border border-[var(--color-boxColor)]  rounded-[15px] w-[70%] p-2"
              >
                {mode === "new" ? "記録する" : "更新する"}
              </button>
              {mode === "edit" && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={disabled}
                  className="hover:bg-[var(--color-bgColor)] bg-decisionBtn border border-[var(--color-boxColor)]  rounded-[15px] w-[70%] p-2"
                >
                  削除
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
