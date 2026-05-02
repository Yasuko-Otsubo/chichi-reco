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
  onDayClick,
}) => {
  const width = useWindowWidth();

  const handleClick = () => {
    if (!day) return;
    onDayClick({ day, record });
  };
  return (
    <div
      className={`${styles.cell} ${isToday ? styles.today : ""} ${day ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      {/* 空白マスか確認 */}
      {day && <div className="text-xs mb-1 text-gray-500">{day}</div>}

      {/* 記録があるか確認 */}
      {record && (
        <div className="text-xs xs:text-sm md:text-base lg:text-lg font-medium text-center">
          {record.weight?.toFixed(1)}
        </div>
      )}

      {/* 前回との差 */}
      {width >= 320 && diff !== null && (
        <div
          className={` text-center ${width >= 500 ? "text-sm" : width >= 375 ? "text-xs" : "text-[12px]"} ${diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-333 font-normal"}`}
        >
          {/* 差分計算 */}
          {width >= 375 && (diff > 0 ? "▲+" : diff < 0 ? "▼" : "±")}

          {diff.toFixed(1)}
        </div>
      )}
    </div>
  );
};
