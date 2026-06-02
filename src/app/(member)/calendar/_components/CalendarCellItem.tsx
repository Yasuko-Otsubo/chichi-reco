import styles from "@/app/_styles/Calendar.module.css";
import { CalendarCell } from "@/types/calendar";
import { RecordData } from "@/types/record";
import { useWindowWidth } from "@/app/_hooks/useWindowWidth";

interface Props {
  day: number | null;
  record: RecordData | null;
  diff: number | null;
  isToday: boolean;
  year: number;
  month: number;
  onDayClick: (cell: CalendarCell) => void;
}
export const CalendarCellItem: React.FC<Props> = ({
  day,
  record,
  diff,
  isToday,
  year,
  month,
  onDayClick,
}) => {
  const width = useWindowWidth();
  const today = new Date();

  const handleClick = () => {
    if (!day) return;
    onDayClick({ day, record });
  };
  return (
    <div
      className={`${styles.cell} ${isToday ? styles.today : ""} ${day && new Date(year, month - 1, day) > today ? "cursor-default" : "cursor-pointer"}`}
      onClick={handleClick}
    >
      {/* 空白マスか確認 */}
      {day && <div className="text-xs text-gray-500/80">{day}</div>}

      {/* 記録があるか確認 */}
      {record && (
        <div className="text-base xs:text-sm font-medium text-center">
          {record.weight?.toFixed(1)}
        </div>
      )}

      {/* 前回との差 */}
      {width >= 320 && diff !== null && (
        <div
          className={` text-center text-[12px] ${diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-333 font-normal"}`}
        >
          {/* 差分計算 */}
          {width >= 375 && (diff > 0 ? "▲+" : diff < 0 ? "▼" : "±")}

          {diff.toFixed(1)}
        </div>
      )}
    </div>
  );
};
