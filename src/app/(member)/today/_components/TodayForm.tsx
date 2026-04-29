import { TodayFormValues } from "@/types/form";
import { RecordData } from "@/types/record";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/Button";

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
      <div className="h-full flex flex-col overflow-hidden">
        <h1 className="text-xl text-center py-4">今日の記録</h1>
        <div className=" bg-white rounded-[15px] mb-3 p-2">
          <div className="text-sm">前回の記録</div>
          <div className="flex justify-center items-center flex-col">
            {prevRecord && (
              <div className="flex justify-center">
                <p className="font-bold m-1 py-0 px-4">{prevRecord.weight}kg</p>
                <p className="font-bold m-1 py-0 px-4">{prevRecord.steps}歩</p>
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
            {isOpen && prevRecord && (
              <p className="p-2 w-[80%] "> {prevRecord.memo}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center bg-white rounded-[15px]  mb-6 p-2">
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
                  className="mx-2 px-4 border border-gray-500  rounded-[15px] py-2 sm:px-6 my-2 sm:mx-6"
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
              <div className="flex justify-between items-center text-sm xs:text-base py-1">
                <label>体重</label>
                <div className="flex items-center">
                  <input
                    className="w-[100px] xs:w-[150px] px-2 text-right border border-[var(--color-bgColor)] rounded-[10px] h-10  sm:px-4"
                    {...register("weight")}
                  />
                  <span className="text-bbb ml-2 w-6">Kg</span>
                </div> 
              </div>
              <div className="flex justify-between items-center text-sm xs:text-base h-10 py-1">
                <label>歩数</label>
                <div className="flex items-center">
                  <input
                    className="w-[100px] xs:w-[150px] px-2 text-right border border-[var(--color-bgColor)] rounded-[10px] h-10  sm:px-4"
                    {...register("steps")}
                  />
                  <span className="text-bbb ml-2 w-6">歩</span>
                </div>
              </div>
              <div className="text-left flex flex-col pt-1 mb-2">
                <label className="mb-2">一言メモ</label>
                <textarea
                  className="border border-[var(--color-bgColor)] rounded-[10px] p-2"
                  {...register("memo")}
                />
              </div>
              <div
                className={`flex justify-center mb-6 ${mode === "edit" && onDelete ? "gap-2" : ""}`}
              >
                <Button type="submit" disabled={disabled} variant="member">
                  {mode === "new" ? "記録する" : "更新する"}
                </Button>
                {mode === "edit" && onDelete && (
                  <Button
                    type="button"
                    onClick={onDelete}
                    disabled={disabled}
                    variant="member"
                  >
                    削除
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
