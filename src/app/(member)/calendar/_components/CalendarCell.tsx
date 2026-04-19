import styles from "@/app/_styles/Calendar.module.css"
import { RecordData } from "@/types/record"

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
        {day && <div className="text-xs text-gray-500">{day}</div>}

        {/* 記録があるか確認 */}
        {record && <div className="text-base font-medium text-center">{record.weight?.toFixed(1)}</div>}

        {/* 前回との差 */}
        {diff !== null && ( 
          <div className={`text-sm text-center ${diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-333 font-normal"}`}>
            {/* 差分計算 */}
            {diff > 0 ? "▲+" : diff < 0 ? "▼" : "±"}
            {diff.toFixed(1)}
          </div>
        )}
      </div>
    );
  };
