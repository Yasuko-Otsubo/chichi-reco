import { RecordData } from "@/app/api/records/[date]/route";
import styles from "@/app/_styles/Calendar.module.css"

interface Props {
  day: number | null
  record: RecordData | null
  diff: number | null
  isToday: boolean
}
export const CalendarCell: React.FC<Props> = ({
  day,
  record,
  diff,
  isToday
}) => {
    return (
      <div className={`${styles.cell} ${isToday ? styles.today : ""}`}>
        {/* 空白マスか確認 */}
        {day && <div>{day}</div>}

        {/* 記録があるか確認 */}
        {record && <div>{record.weight}</div>}

        {/* 前回との差 */}
        {diff !== null && (
          <div>
            {/* 差分計算 */}
            {diff > 0 ? "+" : ""}
            {diff.toFixed(1)}
          </div>
        )}
      </div>
    );
  };
