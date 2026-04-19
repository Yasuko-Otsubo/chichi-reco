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
    <>
      <h1 className="text-xl text-center py-6">今日の記録</h1>
      <div className="max-w-[800px] mx-auto mb-2">
        <div className="bg-white text-center py-2 mb-4 rounded-[10px]">
          <button onClick={() => changeMonth(-1)}>＜</button>
          <span className="text-xl font-medium px-8">
            {year}年 {month}月
          </span>
          <button onClick={() => changeMonth(1)} disabled={year === todayYear && month === todayMonth} className={year === todayYear && month === todayMonth ? "text-gray-300" : ""}>＞</button>
        </div>

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
    </>
  );
};
