import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: Request/*, context: any*/) => {
  try {
    const body = await request.json();
    const { /*user_id, */date, weight, steps, memo, profileId } = body;

    const data = await prisma.records.create({
      data: {
        /*user_id,*/
        date,
        weight,
        steps,
        memo,
        profileId,
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