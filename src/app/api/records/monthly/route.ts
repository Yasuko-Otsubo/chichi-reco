import { RecordResponse } from "@/types/records";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { Record } from "@prisma/client";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";

export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

    const records = await prisma.record.findMany({
      where: {
        profileId: Number(user.id),
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: "asc" },
    });

    const response: RecordResponse = {
      status: "OK",
      message: "取得しました",
      records: records.map((r: Record) => ({
        id: r.id,
        date: r.date.toISOString(),
        weight: r.weight,
        steps: r.steps,
        memo: r.memo,
        profileId: r.profileId,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const response: RecordResponse = {
        status: "NG",
        message: error.message,
      };
      return NextResponse.json(response, { status: 400 });
    }
  }
};
