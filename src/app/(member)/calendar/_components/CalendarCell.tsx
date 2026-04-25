import styles from "@/app/_styles/Calendar.module.css";
import { RecordData } from "@/types/record";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  day: number | null;
  record: RecordData | null;
  diff: number | null;
  isToday: boolean;
  year: number;
  month: number;
}
export const CalendarCell: React.FC<Props> = ({
  day,
  record,
  diff,
  isToday,
  year,
  month,
}) => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    if (!day) return;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    router.push(`/today/${dateStr}`);
  };
  return (
    <div
      className={`${styles.cell} ${isToday ? styles.today : ""} ${day ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      {/* 空白マスか確認 */}
      {day && <div className="text-xs mb-2 text-gray-500">{day}</div>}

      {/* 記録があるか確認 */}
      {record && (
        <div className="text-xs  font-medium text-center">
          {record.weight?.toFixed(1)}
        </div>
      )}

      {/* 前回との差 */}
      {windowWidth >= 360 && diff !== null && (
        <div
          className={`text-xs text-center ${diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-333 font-normal"}`}
        >
          {/* 差分計算 */}
          {diff > 0 ? "▲+" : diff < 0 ? "▼" : "±"}
          {diff.toFixed(1)}
        </div>
      )}
    </div>
  );
};
