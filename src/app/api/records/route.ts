import { NextRequest, NextResponse } from "next/server";
import { RecordCreateRequest, RecordResponse, toRecordFields } from "@/types/records";
import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { Record as PrismaRecord } from "@prisma/client";

export const POST = async (request: NextRequest) => {
  try {
    const body: RecordCreateRequest = await request.json();
    const user = await getAuthenticatedUser(request);
    const { date, weight, steps, memo } = body;
    console.log("Authorization header:", request.headers.get("authorization"));

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 },
      );
    }

    const existring = await prisma.record.findFirst({
      where: {
        profileId: profile.id,
        date: new Date(date),
      },
    });

    if(existring) {
      return NextResponse.json({
        status: "NG",
        message: "この日付は既に記録されています",
        record: [toRecordFields(existring as PrismaRecord)]
      },
    { status: 400 }
    );
  }

    const data = await prisma.record.create({
      data: {
        date: new Date(date),
        weight: weight ?? null,
        steps: steps ?? null,
        memo: memo ?? null,
        profileId: profile.id,
      },
    });

    //const record = toRecordFields(data);

    const response: RecordResponse = {
      status: "OK",
      message: "記録しました",
      records: [toRecordFields(data as PrismaRecord)],
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: RecordResponse = {
      status: "NG",
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(response, { status: 400 });
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 },
      );
    }

    const records = await prisma.record.findMany({
      where: { profileId: profile.id },
    });

    const response: RecordResponse = {
      status: "OK",
      message: "取得しました",
      records: records.map(toRecordFields),
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
