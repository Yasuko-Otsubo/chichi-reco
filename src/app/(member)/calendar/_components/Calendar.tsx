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
  todayYear: number;
  todayMonth: number;
  todayDate: number;
  onDayClick: (cell: CalendarCell) => void;
}

export const Calendar: React.FC<Props> = ({
  calendarData,
  month,
  todayYear,
  todayMonth,
  todayDate,
  onDayClick,
}) => {
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const rows = Math.ceil(calendarData.length / 7);

  return (
    <>
      <div className="w-[100%] mx-auto mb-2">
        <div
          className={styles.calendar}
          style={{ gridTemplateRows: `auto repeat(${rows}, 1fr)` }}
        >
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
