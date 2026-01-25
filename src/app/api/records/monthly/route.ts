import { RecordResponse } from "@/types/records";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { Record } from "@prisma/client";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";

export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);

    const profile = await prisma.profile.findFirst({
      where: { supabaseUserId: user.id },
    });

    if(!profile) {
      return NextResponse.json(
        { status: "NG" , message: "Profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get("year"));
    const monthParam = Number(searchParams.get("month"));
    const month = monthParam - 1;

    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 1));

    const records = await prisma.record.findMany({
      where: {
        profileId: profile.id,
        date: {
          gte: start,
          lt: end,
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
