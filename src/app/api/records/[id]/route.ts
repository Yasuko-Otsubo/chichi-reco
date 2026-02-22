import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import {
  RecordResponse,
  RecordUpdateRequest,
  toRecordFields,
} from "@/types/records";
import { NextRequest, NextResponse } from "next/server";
import { Record as PrismaRecord } from "@prisma/client";
import { getProfileByUserId } from "@/app/_libs/prisma/profile";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { status: "NG", message: "認証されていません" },
      { status: 401 },
    );
  const profile = await getProfileByUserId(user.id);
  try {
    const { id } = await params;

    const record = await prisma.record.findFirst({
      where: {
        id: Number(id),
        profileId: profile.id,
      },
    });

    if (!record) {
      return NextResponse.json(
        { status: "OK", message: "記録はありません", records: [] },
        { status: 200 },
      );
    }

    const response: RecordResponse = {
      status: "OK",
      message: "取得しました",
      records: [toRecordFields(record as PrismaRecord)],
    };

    return NextResponse.json(response, { status: 200 });
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { status: "NG", message: "認証されていません" },
      { status: 401 },
    );
  const profile = await getProfileByUserId(user.id);

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

    // 数値変換とNaNチェック
    const numWeight = weight !== undefined ? Number(weight) : undefined;
    const numSteps = steps !== undefined ? Number(steps) : undefined;

    if (date !== undefined) updateData.date = new Date(date);
    if (numWeight !== undefined && !isNaN(numWeight))
      updateData.weight = numWeight;
    if (numSteps !== undefined && !isNaN(numSteps)) updateData.steps = numSteps;
    if (memo !== undefined) updateData.memo = memo;

    // 更新項目がない場合は返す
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { status: "NG", message: "更新する項目がありません" },
        { status: 400 },
      );
    }

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

    // 差分チェック
    const isSame =
      (weight === undefined || weight === record.weight) &&
      (steps === undefined || steps === record.steps) &&
      (memo === undefined || memo === record.memo) &&
      (date === undefined ||
        new Date(date).getTime() === record.date.getTime());

    if (isSame) {
      return NextResponse.json(
        {
          status: "OK",
          message: "更新の必要はありません",
          records: [toRecordFields(record)],
        },
        { status: 200 },
      );
    }

    const updatedRecord = await prisma.record.update({
      where: {
        id: record.id,
      },
      data: updateData,
    });

    const response: RecordResponse = {
      status: "OK",
      message: "記録を更新しました",
      records: [toRecordFields(updatedRecord)],
    };

    return NextResponse.json(response, { status: 200 });
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
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { status: "NG", message: "認証されていません" },
      { status: 401 },
    );
  const profile = await getProfileByUserId(user.id);

  try {
    await prisma.record.deleteMany({
      where: {
        id: Number(id),
        profileId: profile.id,
      },
    });

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { status: "NG", message: "この日付には記録がありません" },
        { status: 404 },
      );
  }
};
