import { prisma } from "@/app/_libs/prisma"
import { NextResponse } from "next/server"

export type PostsIndexResponse = {
  records: {
    id: number
    date: Date
    weight: number | null
    steps: number | null
    memo: string | null
    profileId: number
    createdAt: Date
    updatedAt: Date | null
  }[]
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month")
  const range = searchParams.get("range")
  try {
  //month
  if (month) {
    const year = Number(month.slice(0, 4))
    const m = Number(month.slice(4,6))

    const from = new Date(year, m - 1, 1)
    const to = new Date(year, m, 0)

    const records = await prisma.record.findMany({
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { date: "asc"},
    })
    return NextResponse.json({ records })
  }

  //range
  if (range) {
    const today = new Date()
    const from = new Date()

    switch (range) {
      case "7days":
        from.setDate(today.getDate() - 6)
        break
      case "1month":
        from.setDate(today.getMonth() - 1)
        break
      case "6month":
        from.setDate(today.getMonth() - 6)
        break
      case "1Year":
        from.setDate(today.getFullYear() - 1)
        break
      case "3Year":
        from.setDate(today.getFullYear() - 3)
        break
    }
    return NextResponse.json({
      records: await prisma.record.findMany({
        where: {
          date: {
            gte: from,
            lte: today,
          },
        },
        orderBy: { date: "asc" },
      }),
    })
  }

  //全件
  return NextResponse.json({
    records: await prisma.record.findMany({
      orderBy: { date: "asc" }
    }),
  })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}