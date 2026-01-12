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

return(
  <>
  <div>ここに本文</div>
  </>
)
}