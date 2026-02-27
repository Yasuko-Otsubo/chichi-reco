import { prisma } from "@/app/_libs/prisma";
import { getProfileByUserId } from "@/app/_libs/prisma/profile"
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth"
import { NextRequest, NextResponse } from "next/server"
import type { Record, Prisma } from "@prisma/client";

export type RecordData = {
  id: number
  date: string
  weight: number | null
  steps: number | null
  memo: string | null
}
export type RecordResponse = {
  status: "OK" | "NG"
  message: string
  record: RecordData
}

const formatRecord = (record: Record): RecordData => {
  return {
    id: record.id,
    date: record.date.toISOString(),
    weight: record.weight,
    steps: record.steps,
    memo: record.memo,
  }
}

export const GET = async (
  request: NextRequest,
  { params }: { params : Promise<{ id: string }>},
)  => {
  const user = await getAuthenticatedUser(request);
  if (!user){
    return NextResponse.json(
    { status: "NG", message: "認証されていません"},
    { status: 401},
  );
  }
  const profile = await getProfileByUserId(user.id);
  if(!profile) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません"},
      { status: 404 }, 
    );
  }

  const { id }= await params

  try {
    const record = await prisma.record.findUnique({
      where: {
        id: Number(id),
        profileId: profile.id,
      },
    });

    if(!record) {
      return NextResponse.json(
        { status: "NG", message: "記録はありません" },
        { status: 404 }
      )
    }

    const recordData = formatRecord(record);
    return NextResponse.json<RecordResponse>({
      status: "OK",
      message: "取得しました",
      record: recordData,
    });
  } catch (error) {
    if(error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 },
      );
    }
  }

}

export type UpdateRecordRequestBody = {
  date?: string
  weight?: number | null
  steps?: number | null
  memo?: string | null
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>},
) => {
  const user = await getAuthenticatedUser(request);
  if (!user){
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません"},
      { status: 404 },
    );
  }
  const profile = await getProfileByUserId(user.id);
  if(!profile) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません"},
      { status: 404 },
    );
  }

  const { id } = await params;
  const { date, weight, steps, memo }: UpdateRecordRequestBody = await request.json();

  try {
    //record取得
    const record = await prisma.record.findFirst({
      where: {
        id: Number(id),
        profileId: profile.id,
      },
      });
      
      if (!record) {
        return NextResponse.json(
          { status: "NG", message: "記録が見つかりません" },
          { status: 404 },
        );
      }

      //dateのみ送られてきた場合を省く
      const hasOtherFields = 
        weight !== undefined ||
        steps !== undefined ||
        memo !== undefined;
      if (!hasOtherFields) {
        return NextResponse.json(
          { status: "NG", message: "いずれかの項目を変更してください" },
          { status: 400 }
        )
      }

      //updateData作成
      const updateData: Prisma.RecordUpdateInput = {};


      //数値変更とNaNチェック
      const numWeight = weight !== undefined ? Number(weight): undefined;
      const numSteps = steps !== undefined ? Number(steps): undefined;

      if (date !== undefined) updateData.date = new Date(date);
      if (numWeight !== undefined && !isNaN(numWeight))
        updateData.weight = numWeight;
      if (numSteps !== undefined && !isNaN(numSteps)) updateData.steps = numSteps;
      if (memo !== undefined) updateData.memo = memo;

      //更新項目がない場合は返す
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { status: "NG", message: "更新する項目がありません" },
          { status: 400 },
        );
      }

      //差分チェック
      const isSame = 
        (weight === undefined || weight === record.weight) &&
        (steps === undefined || steps === record.steps) &&
        (memo === undefined || memo === record.memo) &&
        (date === undefined ||
          new Date(date).getTime() === record.date.getTime());

        if (isSame) {
          return NextResponse.json(
            { status: "OK", message: "更新の必要はありません" },
            { status: 200 },
          );
        }

        //update
        const updatedRecord = await prisma.record.update({
          where: {
            id: record.id,
          },
          data: updateData,
        });

      const recordData = formatRecord(updatedRecord);
      return NextResponse.json<RecordResponse>({
        status: "OK",
        message: "更新しました",
        record: recordData,
      });
  } catch (error) {
    if (error instanceof Error) 
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>},
) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません"},
      { status: 404 },
    );
  }
  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません"},
      { status: 404 },
    );
  }

  const { id } = await params;

  try {
    const record = await prisma.record.findFirst({
      where: {
        id: Number(id),
        profileId: profile.id,
      },
    });

    if (!record) {
      return NextResponse.json(
        { status: "NG", message: "記録が見つかりません" },
        { status: 404 }
      );
    }

    //idを指定してrecordを削除
    await prisma.record.delete({
      where: {
        id: record.id,
      },
    });

    return NextResponse.json({ message: "OK"}, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}