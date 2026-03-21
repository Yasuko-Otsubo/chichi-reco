import { getProfileByUserId } from "@/_utils/profile";
import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { ApiResponse } from "@/types/api";
import { PrismaUpdateProfile, ProfileResponse, toProfileFields, UpdateProfileRequest, UpdateProfileResponse } from "@/types/profiles";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
  try {
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

    return NextResponse.json(
      {
        status: "OK",
        message: "取得しました",
        profiles: [toProfileFields(profile)],
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "NG",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 },
    );
  }
};

export const PUT = async (request: NextRequest) => {

  try {
    const body: UpdateProfileRequest = await request.json();
    const { name, targetWeight, height } = body;
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

    const updateData: PrismaUpdateProfile = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.targetWeight !== undefined) updateData.targetWeight = body.targetWeight;
    if (body.height !== undefined) updateData.height = body.height;

    const isSame =
  (name === undefined || name === profile.name) &&
  (height === undefined || height === profile.height) &&
  (targetWeight === undefined || targetWeight === profile.targetWeight);

if (isSame) {
  return NextResponse.json<UpdateProfileResponse>(
    {
      status: "OK",
      message: "更新の必要はありません",
      profiles: [toProfileFields(profile)],
    },
    { status: 200 },
  );
}

    const updatedProfile = await prisma.profile.update({
      where: { supabaseUserId: user.id },
      data: updateData,
    });

    const response: UpdateProfileResponse = {
      status: "OK",
      message: "プロフィールを更新しました",
      profiles: [toProfileFields(updatedProfile)],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const response: ProfileResponse = {
        status: "NG",
        message: error.message,
      };
      return NextResponse.json(response, { status: 400 });
    }
  }
};
