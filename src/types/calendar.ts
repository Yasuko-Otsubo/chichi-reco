import { RecordData } from "./record";

export type CalendarCell = {
  day: number;
  record: RecordData | null;
}