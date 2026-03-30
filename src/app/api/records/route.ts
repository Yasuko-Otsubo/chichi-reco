import { prisma } from "@/app/_libs/prisma";
import { getProfileByUserId } from "@/_utils/profile";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import {
  CreateRecordRequestBody,
  RecordData,
  RecordResponse,
  RecordsResponse,
} from "@/types/record";
import type { Record } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

const formatRecords = (records: Record[]): RecordData[] => {
  return records.map((record) => ({
    id: record.id,
    date: record.date.toISOString(),
    weight: record.weight,
    steps: record.steps,
    memo: record.memo,
  }));
};

export const POST = async (request: NextRequest) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json<ApiResponse>(
      { status: "NG", message: "認証されていません" },
      { status: 401 },
    );
  }

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json<ApiResponse>(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }

  try {
    const body: CreateRecordRequestBody = await request.json();
    const { date, weight, steps, memo } = body;

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      return NextResponse.json<ApiResponse>(
        { status: "NG", message: "未来の日付は登録できません" },
        { status: 400 },
      );
    }

    const data = await prisma.record.create({
      data: {
        profileId: profile.id,
        date: new Date(date),
        weight,
        steps,
        memo,
      },
    });
    return NextResponse.json({
      id: data.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json<ApiResponse>(
      {
        status: "NG",
        message: message,
      },
      { status: 400 },
    );
  }
};

export const GET = async (request: NextRequest) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json<ApiResponse>(
      { status: "NG", message: "認証されていません" },
      { status: 401 },
    );
  }

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json<ApiResponse>(
      { status: "NG", message: "プロフィールが見つかりません" },
      { status: 404 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    // 表示した記録の前日のデータを取得する
    const before = searchParams.get("before");
    if (before) {
      const record = await prisma.record.findFirst({
        where: {
          profileId: profile.id,
          date: { lt: new Date(before) },
        },
        orderBy: { date: "desc" },
      });
      return NextResponse.json<RecordResponse>({
        status: "OK",
        message: record ? "取得しました" : "記録はありません",
        record: record ? formatRecords([record])[0] : null,
      });
    }
    //month
    const date = searchParams.get("date");
    if (date) {
      const from = new Date(date);
      const to = new Date(date);
      to.setHours(23, 59, 59, 999);

      const records = await prisma.record.findMany({
        where: {
          profileId: profile.id,
          date: {
            gte: from,
            lte: to,
          },
        },
      });
      const formattedRecords = formatRecords(records);
      return NextResponse.json<RecordsResponse>({
        status: "OK",
        message: "取得しました",
        records: formattedRecords,
      });
    }

    const month = searchParams.get("month");
    const range = searchParams.get("range");

    if (month) {
      const year = Number(month.slice(0, 4));
      const m = Number(month.slice(5, 7));

      const from = new Date(Date.UTC(year, m - 1, 1));
      const to = new Date(Date.UTC(year, m, 1));

      const records = await prisma.record.findMany({
        where: {
          profileId: profile.id,
          date: {
            gte: from,
            lt: to,
          },
        },
        orderBy: { date: "asc" },
      });

      const formattedRecords = formatRecords(records);
      return NextResponse.json<RecordsResponse>({
        status: "OK",
        message: "取得しました",
        records: formattedRecords,
      });
    }

    //range
    if (range) {
      const today = new Date();
      const from = new Date();

      switch (range) {
        case "7days":
          from.setDate(today.getDate() - 6);
          from.setHours(0, 0, 0, 0);
          break;
        case "1month":
          from.setDate(1);
          break;
        case "6month":
          from.setMonth(today.getMonth() - 6);
          from.setDate(1);
          break;
        case "1year":
          from.setFullYear(today.getFullYear() - 1);
          from.setDate(1);
          break;
        case "3year":
          from.setFullYear(today.getFullYear() - 3);
          from.setDate(1);
          break;
        default:
          return NextResponse.json(
            { status: "NG", message: "invalid range" },
            { status: 400 },
          );
      }

      const records = await prisma.record.findMany({
        where: {
          profileId: profile.id,
          date: {
            gte: from,
            lte: today,
          },
        },
        orderBy: { date: "asc" },
      });

      const formattedRecords = formatRecords(records);
      return NextResponse.json<RecordsResponse>({
        status: "OK",
        message: "取得しました",
        records: formattedRecords,
      });
    }

    //全件
    const records = await prisma.record.findMany({
      where: {
        profileId: profile.id,
      },
      orderBy: { date: "asc" },
    });

    const formattedRecords = formatRecords(records);
    return NextResponse.json<RecordsResponse>({
      status: "OK",
      message: "取得しました",
      records: formattedRecords,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json<ApiResponse>(
      {
        status: "NG",
        message: message,
      },
      {
        status: 400,
      },
    );
  }
};
