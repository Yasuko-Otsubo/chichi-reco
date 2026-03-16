import { TodayFormValues } from "@/types/form";
import { UseFormRegister } from "react-hook-form";

interface Props {
  mode: "new" | "edit";

  register: UseFormRegister<TodayFormValues>;

  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onDelete?: () => void;
  disabled: boolean;
}

export const TodayForm: React.FC<Props> = ({
  mode,
  register,
  onSubmit,
  onDelete,
  disabled,
}) => (
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
);
