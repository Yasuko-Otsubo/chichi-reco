import {  NextRequest, NextResponse } from "next/server";
import { RecordFields, RecordResponse } from "@/types/records";
import { toRecordFields } from "@/utils/records";
import { requireUser } from "@/utils/auth";
import { prisma } from "@/lib/prisma";


export const POST = async (request: Request) => {
  try {
    const body: RecordFields = await request.json();
    const { date, weight, steps, memo, profileId } = body;

    const data = await prisma.records.create({
      data: {
        date : new Date(date),
        weight,
        steps,
        memo,
        profileId: Number(profileId),
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
    if ( error instanceof Error) {
      const response: RecordResponse = {
        status: "NG",
        message: error.message,
      };
      return NextResponse.json(response, { status: 400});
    }
  }
} ;

export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);

    const records = await prisma.records.findMany({
      where: { profileId: Number(user.id) },
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
