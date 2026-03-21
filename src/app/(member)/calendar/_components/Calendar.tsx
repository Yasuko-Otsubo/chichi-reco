import styles from "@/app/_styles/Calendar.module.css";
import { CalendarCell } from "./CalendarCell";
import { RecordData } from "@/types/record";

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

        {calendarData.map(({ day, record, diff}, i) => {
          const isToday = 
          year  === todayYear &&
          month === todayMonth &&
          day === todayDate;
          return (
            <CalendarCell
              key={i}
              day={day}
              record={record}
              diff={diff}
              isToday={isToday}
              />
          );
        })}


      </div>
    </div>
  );
};
