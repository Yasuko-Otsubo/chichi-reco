import { prisma } from "@/lib/prisma";
import { RecordResponse, RecordUpdateRequest } from "@/types/records";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

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
