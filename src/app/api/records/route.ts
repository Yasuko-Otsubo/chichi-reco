import { prisma } from "@/app/_libs/prisma"
import { getProfileByUserId } from "@/app/_libs/prisma/profile"
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth"
import { NextRequest, NextResponse } from "next/server"

export type CreateRecordRequestBody = {
  date: string
  weight: number | null
  steps: number | null
  memo: string | null
}

export type CreateRecordResponse = {
  id: number
}

export type RecordsIndexResponse = {
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

export const POST = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);
    const profile = await getProfileByUserId(user.id);

    const body : CreateRecordRequestBody = await request.json()
    const { date, weight, steps, memo } = body

    const data = await prisma.record.create({
      data: {
        profileId: profile.id,
        date: new Date(date),
        weight,
        steps,
        memo,
      },
    })
      return NextResponse.json<CreateRecordResponse>({
    id: data.id,
  })
} catch (error) {
  if(error instanceof Error){
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
}

export const GET = async (request: NextRequest) => {
  try {
  //month
  const user = await getAuthenticatedUser(request);
  const profile = await getProfileByUserId(user.id);  
  const { searchParams } = new URL(request.url)
  const month = searchParams.get("month")
  const range = searchParams.get("range")

  if (month) {
    const year = Number(month.slice(0, 4))
    const m = Number(month.slice(4,6))

    const from = new Date(year, m - 1, 1)
    const to = new Date(year, m, 0)

    const records = await prisma.record.findMany({
      where: {
      profileId: profile.id,
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
        from.setMonth(today.getMonth() - 1)
        break
      case "6month":
        from.setMonth(today.getMonth() - 6)
        break
      case "1Year":
        from.setFullYear(today.getFullYear() - 1)
        break
      case "3Year":
        from.setFullYear(today.getFullYear() - 3)
        break
    }
    return NextResponse.json({
      records: await prisma.record.findMany({
        where: {
          profileId: profile.id,
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
      where: {
        profileId: profile.id,
      },
      orderBy: { date: "asc" }
    }),
  })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}