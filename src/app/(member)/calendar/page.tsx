'use client'


type Record = {
  date: string;
  weight: number;
  steps: number;
  memo: string;
}

type CalendarCell = {
  date: string;
  day: number;
  weight?: number;
  delta?: number;
}


export default function Page() {
  const getMonthRange = (year: number, month: number) => {
    const start = new Date(year, month, 1); //月の開始日
    const end = new Date(year, month + 1, 0 );//月の終了日

    return {
      startStr: start.toISOString().slice(0, 10),
      endStr: end.toISOString().slice(0, 10),
    }
  }

return(
  <>
  <div>ここに本文</div>
  </>
)
}