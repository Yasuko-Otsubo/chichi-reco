import { NextRequest, NextResponse } from "next/server";
import { toRecordFields } from "@/utils/records";
import { requireUser } from "@/utils/auth";
import { RecordResponse, RecordUpdateRequest } from "@/types/records";
import { supabase } from "@/utils/supabase";
import { prisma } from "@/lib/prisma";



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
          date: record.date, // Date → string に変換
          weight: record.weight,
          steps: record.steps,
          memo: record.memo,
          profileId: (record.profileId), // number → string に変換
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


export const DELETE = async ( request: NextRequest ) => {
  const token = request.headers.get('Authorization') ?? ''
  const { data, error } = await supabase.auth.getUser(token);


    if(error){
    return NextResponse.json(
      { status: "NG" , message: error.message } , 
      { status: 401})
  }

    const user = data.user;

  try {
    const body = await request.json();
    const { date } = body; // リクエストから日付を受け取る
    
    if(!date) {
      return NextResponse.json(
        { status: "NG", message: "日付が指定されていません" },
        { status: 400 }
      );
    }
    
    const profile = await prisma.profiles.findUnique({
      where: { supabase_user_id: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    
    await prisma.records.delete({
      where: {
        profileId_date: {
          profileId: profile.id,
          date: new Date(date)
        }
      },
    }) ;

    return NextResponse.json({ status: "OK"}, { status : 200 })
  } catch(error) {
    if(error instanceof Error) 
      return NextResponse.json ({ status: "NG", message: "この日付には記録がありません"}, { status: 404 })

  }
};

