import { prisma } from "@/lib/prisma";
import { RecordResponse, RecordUpdateRequest } from "@/types/records";
import { getUserFromHeader } from "@/utils/auth";
import { toRecordFields } from "@/utils/records";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (
  request: NextRequest,
  { params } : { params: { id: string }}
) => {
  try {
    const user = await getUserFromHeader(request);

    const record = await prisma.records.findUnique({
      where: {
          id: Number(params.id),
       },
    });

    const profile = await prisma.profiles.findUnique({
      where: { supabase_user_id: user.id}
    });

    if(!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    if (!record || record.profileId !== profile.id) {
      return NextResponse.json(
        { status: "OK", 
          message: "記録はありません",
          records: [] 
        },
        { status: 200 }
      );
    }

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
  { params }: { params: { id: string } }
) => {
  const { id } = params;

    const user = await getUserFromHeader(request);

    type PrismaRecordUpdate = {
      date?: Date;
      weight?: number;
      steps?: number;
      memo?: string;
    };

    try {
      const body: RecordUpdateRequest = await request.json();
      const { date, weight, steps, memo } = body;

    const updateData: PrismaRecordUpdate = {};

    if (date !== undefined) updateData.date = new Date(date);
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
          date: record.date, 
          weight: record.weight,
          steps: record.steps,
          memo: record.memo,
          profileId: record.profileId, 
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
  { params }: { params: { id: string }  }
   ) => {
     const { id } = params;
    const user = await getUserFromHeader(request);

  try {
    
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
          id: Number(id),
          profileId: profile.id
      },
    }) ;

    return NextResponse.json({ status: "OK"}, { status : 200 })
  } catch(error) {
    if(error instanceof Error) 
      return NextResponse.json ({ status: "NG", message: "この日付には記録がありません"}, { status: 404 })

  }
};
