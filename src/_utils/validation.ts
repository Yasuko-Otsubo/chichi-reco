import { ApiResponse } from "@/types/api";
import { NextResponse } from "next/server";

export const isValidWeight = (weight: number) => {
  return weight >= 20 && weight <= 200;
};

export const isValidSteps = (steps: number) => {
  return steps >= 0 && steps <= 40000;
};

export const isValidMorningSystolic = (morningSystolic: number) => {
  return morningSystolic >= 30 && morningSystolic <= 300;
};

export const isValidMorningDiastolic = (morningDiastolic: number) => {
  return morningDiastolic >= 30 && morningDiastolic <= 300;
};

export const isValidEveningSystolic = (eveningSystolic: number) => {
  return eveningSystolic >= 30 && eveningSystolic <= 300;
};

export const isValidEveningDiastolic = (eveningDiastolic: number) => {
  return eveningDiastolic >= 30 && eveningDiastolic <= 300;
};

export const validateRecordFields = (fields: {
  weight?: number | null;
  steps?: number | null;
  morningSystolic?: number | null;
  morningDiastolic?: number | null;
  eveningSystolic?: number | null;
  eveningDiastolic?: number | null;
}) => {
  const {
    weight,
    steps,
    morningSystolic,
    morningDiastolic,
    eveningSystolic,
    eveningDiastolic,
  } = fields;

  if (weight !== undefined && weight !== null && !isValidWeight(weight)) {
    return NextResponse.json<ApiResponse>(
      { status: "NG", message: "体重は20kg以上200kg以下で入力してください" },
      { status: 400 },
    );
  }

  if (steps !== undefined && steps !== null && !isValidSteps(steps)) {
    return NextResponse.json<ApiResponse>(
      { status: "NG", message: "歩数は0~40000歩の間で入力してください" },
      { status: 400 },
    );
  }

  if (
    morningSystolic !== undefined &&
    morningSystolic !== null &&
    !isValidMorningSystolic(morningSystolic)
  ) {
    return NextResponse.json<ApiResponse>(
      {
        status: "NG",
        message: "朝の血圧（収縮期）は30～300の範囲で入力してください",
      },
      { status: 400 },
    );
  }

  if (
    morningDiastolic !== undefined &&
    morningDiastolic !== null &&
    !isValidMorningDiastolic(morningDiastolic)
  ) {
    return NextResponse.json<ApiResponse>(
      {
        status: "NG",
        message: "朝の血圧（拡張期）は30～300の範囲で入力してください",
      },
      { status: 400 },
    );
  }

  if (
    eveningSystolic !== undefined &&
    eveningSystolic !== null &&
    !isValidEveningSystolic(eveningSystolic)
  ) {
    return NextResponse.json<ApiResponse>(
      {
        status: "NG",
        message: "夜の血圧（収縮期）は30～300の範囲で入力してください",
      },
      { status: 400 },
    );
  }

  if (
    eveningDiastolic !== undefined &&
    eveningDiastolic !== null &&
    !isValidEveningDiastolic(eveningDiastolic)
  ) {
    return NextResponse.json<ApiResponse>(
      {
        status: "NG",
        message: "夜の血圧（拡張期）は30～300の範囲で入力してください",
      },
      { status: 400 },
    );
  }
  return null;
};
