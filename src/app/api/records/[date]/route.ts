import { prisma } from "@/app/_libs/prisma";
import { getProfileByUserId } from "@/_utils/profile";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { NextRequest, NextResponse } from "next/server";
import type { Record, Prisma } from "@prisma/client";
import { RecordData } from "@/types/record";

export type RecordResponse = {
  status: "OK" | "NG";
  message: string;
  record: RecordData;
};

const formatRecord = (record: Record): RecordData => {
  return {
    id: record.id,
    date: record.date.toISOString(),
    weight: record.weight,
    steps: record.steps,
    memo: record.memo,
  };
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { status: "NG", message: "認証されていません" },
      { status: 401 },
    );
  }
  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }

  const { date } = await params;

  try {
    const record = await prisma.record.findFirst({
      where: {
        date: new Date(date),
        profileId: profile.id,
      },
    });

    if (!record) {
      return NextResponse.json(
        { status: "NG", message: "記録はありません" },
        { status: 404 },
      );
    }

    //const recordData = formatRecord(record);
    return NextResponse.json<RecordResponse>({
      status: "OK",
      message: "取得しました",
      record: formatRecord(record),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

export type UpdateRecordRequestBody = {
  date?: string;
  weight?: number | null;
  steps?: number | null;
  memo?: string | null;
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }
  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }

  const { date } = await params;
  const {
    date: newDate,
    weight,
    steps,
    memo,
  }: UpdateRecordRequestBody = await request.json();

  console.log("weight:", weight);
  console.log("steps:", steps);

  try {
    //record取得
    const record = await prisma.record.findFirst({
      where: {
        date: new Date(date),
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
      weight !== undefined || steps !== undefined || memo !== undefined;
    if (!hasOtherFields) {
      return NextResponse.json(
        { status: "NG", message: "いずれかの項目を変更してください" },
        { status: 400 },
      );
    }

    //updateData作成
    const updateData: Prisma.RecordUpdateInput = {};

    //数値変更とNaNチェック
    const numWeight =
      weight === null || weight === undefined ? null : Number(weight);
    const numSteps =
      steps === null || steps === undefined ? null : Number(steps);

    if (newDate !== undefined) updateData.date = new Date(newDate);
    if (numWeight === null) {
      updateData.weight = null;
    } else if (!Number.isNaN(numWeight)) {
      updateData.weight = numWeight;
    }

    if (numSteps === null) {
      updateData.steps = null;
    } else if (!Number.isNaN(numSteps)) {
      updateData.steps = numSteps;
    }

    //更新項目がない場合は返す
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { status: "NG", message: "更新する項目がありません" },
        { status: 400 },
      );
    }

    //差分チェック
    const isSame =
      (numWeight === undefined || numWeight === record.weight) &&
      (numSteps === undefined || numSteps === record.steps) &&
      (memo === undefined || memo === record.memo) &&
      (newDate === undefined ||
        new Date(newDate).getTime() === record.date.getTime());

    if (isSame) {
      return NextResponse.json(
        {
          status: "OK",
          message: "更新の必要はありません",
          record: formatRecord(record),
        },
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
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }
  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }

  const { date } = await params;

  try {
    const targetDate = new Date(`${date}T00:00:00Z`);
    const nextDate = new Date(`${date}T23:59:59Z`);
    const result = await prisma.record.deleteMany({
      where: {
        profileId: profile.id,
        date: {
          gte: targetDate,
          lte: nextDate,
        },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { status: "NG", message: "記録が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "OK", message: "削除しました" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
