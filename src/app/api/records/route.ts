import {  NextRequest, NextResponse } from "next/server";
import { RecordFields, RecordResponse } from "@/types/records";
import { toRecordFields } from "@/utils/records";
import { requireUser } from "@/utils/auth";
import { prisma } from "@/lib/prisma";


export const POST = async (request: NextRequest) => {
  
  try {
    const body: RecordFields = await request.json();
    const user = await requireUser(request);
    const { date, weight, steps, memo } = body;
    console.log("Authorization header:", request.headers.get("authorization"));


    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    const data = await prisma.record.create({
      data: {
        date : new Date(date),
        weight: Number(weight),
        steps: Number(steps),
        memo,
        profileId: profile.id,
      },
    });

    const record = toRecordFields(data);
    

    const response: RecordResponse = {
      status: "OK",
      message: "記録しました",
      records: [record],
    };
    return NextResponse.json(response, { status: 200 });
} catch (error) {
  console.error("CREATE ERROR:", error);

  const response: RecordResponse = {
    status: "NG",
    message: error instanceof Error ? error.message : "Unknown error",
  };
  return NextResponse.json(response, { status: 400 });
}  
}


export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId : user.id }
    })
    
    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }


    const records = await prisma.record.findMany({
      where: { profileId: profile.id },
    });

    const response: RecordResponse = {
      status: "OK",
      message: "取得しました",
      records: records.map(toRecordFields)
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if(error instanceof Error) {
      const response: RecordResponse = {
        status: "NG",
        message: error.message,
      };
      return NextResponse.json(response, { status: 400 });
    }
  }
};
