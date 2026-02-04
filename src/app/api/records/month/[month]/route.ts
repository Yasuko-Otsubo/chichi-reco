import { RecordResponse, toRecordFields } from "@/types/records";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { Record as PrismaRecord } from "@prisma/client";

export const GET = async (
  request: NextRequest,
{ params }: { params: { month: string }}
) => {
  try {
    console.log("AUTH HEADER:", request.headers.get("authorization"));
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

    const [yearStr, monthStr] = params.month.split("-");
    const year = Number(yearStr);
    const monthParam = Number(monthStr);
    const month = monthParam -1;

    if(!year || !monthParam) {
      return NextResponse.json(
        { status: "NG", message: "year, month が必要です"},
        { status: 400 }
      );
    }

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
      records: records.map((r) => toRecordFields(r as PrismaRecord)),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const response: RecordResponse = {
        status: "NG",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      return NextResponse.json(response, { status: 400 });
    }
  }
};
