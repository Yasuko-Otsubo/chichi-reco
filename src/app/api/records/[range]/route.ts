import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { RecordResponse, toRecordFields } from "@/types/records";
import { NextRequest, NextResponse } from "next/server";
import { Record as PrismaRecord } from "@prisma/client";


export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);

    const profile = await prisma.profile.findFirst({
      where: { supabaseUserId: user.id },
    });

    if(!profile) {
      return NextResponse.json(
        { status: "NG", message: "Profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "week"

    const now = new Date();
    const start = new Date(now)
    const end  =  new Date(now)

    switch(type) {
      case "week":
        start.setDate(start.getDate() -6)
        break;
      
      case "month":
        start.setMonth(start.getMonth() - 1)
        break;

      case "half-year":
        start.setMonth(start.getMonth() - 6)
        break;

      case "year":
        start.setFullYear(start.getFullYear() - 1)
        break;

      case "all":
        start.setFullYear(start.getFullYear() - 3)
        break;
    }

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
    if (error instanceof Error ) {
      const response: RecordResponse = {
        status: "NG",
        message: error instanceof Error ? error.message: "Unknown error",
      };
      return NextResponse.json(response, { status: 400 });
    }
  }
};