import {  NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { RecordFields } from "@/types/records";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    const body: RecordFields = await request.json();
    const { date, weight, steps, memo, profileId } = body;

    const data = await prisma.records.upsert({
      where: { supabase_user_id: user.id},
      update : {
        date,
        weight,
        steps,
        memo,
      },
      create: {
        date : new Date(date),
        weight,
        steps,
        memo,
      },
    });
    return NextResponse.json({
      status: "OK",
      message: "記録しました",
      id: data.id,
    });
  } catch (error) {
    if ( error instanceof Error) {
      return NextResponse.json({ status: error.message}, { status: 400});
    }
  }
} ;