type CalendarData = {
  day: number | null
  record: RecordData | null
  diff: number | null
}

type RecordData = {
  id: string
  date: string
  weight: number | null
  steps: number | null
  memo: string | null
}

interface Props {
  calendarData: CalendarData[]
  year: number
  month: number
  changeMonth: (diff: number) => void
  todayYear: number
  todayMonth: number
  todayDate: number
}