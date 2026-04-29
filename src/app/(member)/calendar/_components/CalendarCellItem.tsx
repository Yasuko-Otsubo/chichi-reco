import styles from "@/app/_styles/Calendar.module.css";
import { CalendarCell } from "@/types/calendar";
import { RecordData } from "@/types/record";
import { useEffect, useState } from "react";

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
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {windowWidth >= 320 && diff !== null && (
        <div
          className={` text-center ${windowWidth >= 500 ? "text-sm" : windowWidth >= 375 ? "text-xs" : "text-[12px]"} ${diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-333 font-normal"}`}
        >
          {/* 差分計算 */}
          {windowWidth >= 375 && (diff > 0 ? "▲+" : diff < 0 ? "▼" : "±")}

          {diff.toFixed(1)}
        </div>
      )}
    </div>
  );
};
