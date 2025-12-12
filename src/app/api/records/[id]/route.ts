import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { toRecordFields } from "@/utils/records";
import { requireUser } from "@/utils/auth";
import { RecordFields, RecordResponse } from "@/types/records";

const prisma = new PrismaClient();


export const GET = async (
  request: NextRequest,
  { params } : { params: { date: string }}
) => {
  try {
    const user = await requireUser(request);

    const record = await prisma.records.findUnique({
      where: {
        profileId_date: {
          profileId: Number(user.id),
          date: new Date(params.date),
        },
       },
    });

    const response: RecordResponse = {
      status: "OK",
      message: "取得しました",
      records: record ? [toRecordFields(record)] : []
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

export const PUT = async (
  request: NextRequest,
  { params } : { params: { id: string }}
) => {
  const { id } = params;
  const { date, weight, steps, memo } = await request.json();

  try {
    const metadata: RecordFields = {};
    
    if(date) metadata.date = date;
    if(weight) metadata.weight = weight;
    if(steps) metadata.steps = steps;
    if(memo) metadata.memo = memo;

    if(Object.keys(metadata).length === 0 ) {
      return NextResponse.json({ status: "更新対象がありません"}, { status: 400 });
    }
      const record = await prisma.records.update({
      where: {
        id: parseInt(id),
      },
      data: metadata ,
    });

    return NextResponse.json({ status: "OK", record }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400});
  }  
};

export const DELETE = async (
  request: NextRequest,
  {params}: { params : {id : string }},
) => {
  const { id } = params;

  try {
    await prisma.records.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ status: "OK"}, { status : 200 })
  } catch(error) {
    if(error instanceof Error) 
      return NextResponse.json ({ status: error.message}, { status: 400 })

  }
};

