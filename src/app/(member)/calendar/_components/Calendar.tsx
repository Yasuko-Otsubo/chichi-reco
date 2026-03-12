import styles from "@/app/_styles/Calendar.module.css";
import { RecordData } from "@/app/api/records/[date]/route";

type CalendarData = {
  day: number | null;
  record: RecordData | null;
  diff: number | null;
};

interface Props {
  calendarData: CalendarData[];
  year: number;
  month: number;
  changeMonth: (diff: number) => void;
  todayYear: number;
  todayMonth: number;
  todayDate: number;
}

export const Calendar: React.FC<Props> = ({
  calendarData,
  year,
  month,
  changeMonth,
  todayYear,
  todayMonth,
  todayDate,
}) => {
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className={styles.container}>
      <button onClick={() => changeMonth(-1)}>⇐</button>
      <span>
        {year}年 {month}月
      </span>
      <button onClick={() => changeMonth(1)}>⇒</button>
      <div className={styles.calendar}>
        {weekDays.map((day) => (
          <div key={day} className={styles.header}>
            {day}
          </div>
        ))}

        {calendarData.map(({ day, record, diff }, i) => {
          const isToday =
            year === todayYear && month === todayMonth && day === todayDate;

          return (
            <div
              key={i}
              className={`${styles.cell} ${isToday ? styles.today : ""}`}
            >
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
        })}
      </div>
    </div>
  );
};
