import { prisma } from "@/app/_libs/prisma";
import { RecordResponse, RecordUpdateRequest } from "@/types/records";
import { requireUser } from "@/utils/auth";
import { toRecordFields } from "@/utils/records";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const user = await requireUser(request);

    const record = await prisma.record.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 },
      );
    }

    if (!record || record.profileId !== profile.id) {
      return NextResponse.json(
        { status: "OK", message: "記録はありません", records: [] },
        { status: 200 },
      );
    }

    const response: RecordResponse = {
      status: "OK",
      message: "取得しました",
      records: record ? [toRecordFields(record)] : [],
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
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  const user = await requireUser(request);

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

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id }, // ← UUIDで検索
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 },
      );
    }

    const record = await prisma.record.update({
      where: { id: Number(id), profileId: profile.id },
      data: updateData,
    });

    const response: RecordResponse = {
      status: "OK",
      message: "記録を更新しました",
      records: [
        {
          id: record.id,
          date: record.date.toISOString(),
          weight: record.weight,
          steps: record.steps,
          memo: record.memo,
          profileId: record.profileId,
        },
      ],
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
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const user = await requireUser(request);

  try {
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "NG", message: "プロフィールが見つかりません" },
        { status: 404 },
      );
    }

    await prisma.record.delete({
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
