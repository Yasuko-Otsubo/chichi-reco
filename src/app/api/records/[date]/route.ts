import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { toRecordFields } from "@/utils/records";
import { requireUser } from "@/utils/auth";
import { RecordFields, RecordResponse, RecordUpdateRequest } from "@/types/records";
import { supabase } from "@/utils/supabase";

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
  const token = request.headers.get('Authorization') ?? ''
  const { data, error } = await supabase.auth.getUser(token);

  if(error){
    return NextResponse.json(
      { status: "NG" , message: error.message } , 
      { status: 401})
  }

    const user = data.user;

    try {
      const body: RecordUpdateRequest = await request.json();
      const { date, weight, steps, memo } = body;

    const updateData: Partial<RecordUpdateRequest> = {};
    if (date !== undefined) updateData.date = date;
    if (weight !== undefined) updateData.weight = weight;
    if (steps !== undefined) updateData.steps = steps;
    if (memo !== undefined) updateData.memo = memo;

    const profile = await prisma.profiles.findUnique({
      where: { supabase_user_id: user.id }, // ← UUIDで検索
    });


    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }


    const record = await prisma.records.update({
      where: { id: Number(id), profileId: profile.id },
      data: updateData,
    });

    const response: RecordResponse = {
      status: "OK",
      message: "記録を更新しました",
 records: [
        {
          id: record.id,
          date: record.date.toISOString(), // Date → string に変換
          weight: record.weight,
          steps: record.steps,
          memo: record.memo,
          profileId: String(record.profileId), // number → string に変換
        },
      ],
    };

    return NextResponse.json(response, { status: 200});
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

