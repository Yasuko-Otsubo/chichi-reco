'use client'

import { useParams } from 'next/navigation'

export default function EntryPage() {
  const params = useParams()
  const date = params?.date

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">
        {date} の記録ページ
      </h1>
    </div>
  )
}