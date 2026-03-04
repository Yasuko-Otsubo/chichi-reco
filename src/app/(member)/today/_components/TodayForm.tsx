
interface Props {
  mode: 'new'| 'edit'
  date: string

  weight: string
  setWeight: (v: string) => void

  steps: string
  setSteps: (v: string) => void

  memo: string
  setMemo: (v: string) => void

  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
  disabled: boolean
}

export const TodayForm: React.FC<Props> = ({
  mode,
  date,
  weight,
  setWeight,
  steps,
  setSteps,
  memo,
  setMemo,
  onSubmit,
  onDelete,
  disabled
}) => (
    <form onSubmit={onSubmit}>
      <div>
        <label>日付</label>
        <input className="border-2" type="text" value={date} readOnly />
      </div>
      <div>
        <label>体重</label>
        <input
          className="border-2"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div>
        <label>歩数</label>
        <input
          className="border-2"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
      </div>
      <div>
        <label>一言メモ</label>
        <input
          className="border-2"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
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
)
