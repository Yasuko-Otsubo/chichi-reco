import styles from "@/app/_styles/Calendar.module.css";
import { RecordData } from "@/types/record";
import { CalendarCellItem } from "./CalendarCellItem";
import { CalendarCell } from "@/types/calendar";

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
  onDayClick: (cell: CalendarCell) => void;
}

export const Calendar: React.FC<Props> = ({
  calendarData,
  year,
  month,
  changeMonth,
  todayYear,
  todayMonth,
  todayDate,
  onDayClick,
}) => {
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <>
      <h1 className="text-xl text-center py-4">カレンダー</h1>
      <div className="w-[100%] mx-auto mb-2">
        <div className="bg-white text-center py-2 mb-4 rounded-[10px]">
          <button onClick={() => changeMonth(-1)}>＜</button>
          <span className="text-xl font-medium px-8">
            {year}年 {month}月
          </span>
          <button
            onClick={() => changeMonth(1)}
            disabled={year === todayYear && month === todayMonth}
            className={
              year === todayYear && month === todayMonth ? "text-gray-300" : ""
            }
          >
            ＞
          </button>
        </div>

        <div className={styles.calendar}>
          {weekDays.map((day) => (
            <div key={day} className={styles.header}>
              {day}
            </div>
          ))}

          {calendarData.map(({ day, record, diff }, i) => {
            const year = month === 12 ? todayYear + 1 : todayYear;
            const isToday =
              year === todayYear && month === todayMonth && day === todayDate;
            return (
              <CalendarCellItem
                key={i}
                day={day}
                record={record}
                diff={diff}
                isToday={isToday}
                year={year}
                month={month}
                onDayClick={onDayClick}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
