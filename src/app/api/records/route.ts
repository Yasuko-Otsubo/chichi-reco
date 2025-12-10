import {  NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { RecordFields, RecordResponse } from "@/types/records";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    const body: RecordFields = await request.json();
    const { date, weight, steps, memo, profileId } = body;

    const data = await prisma.records.upsert({
      where: { id: body.id},
      update : {
        date: new Date(date),
        weight,
        steps,
        memo,
        profileId: Number(profileId),
      },
      create: {
        date : new Date(date),
        weight,
        steps,
        memo,
        profileId: Number(profileId),
      },
    });

    const record: RecordFields = {
      id: data.id,
      date: data.date.toISOString(),
      weight: data.weight,
      steps: data.steps,
      memo: data.memo,
      profileId: String(data.profileId),
    };

    

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