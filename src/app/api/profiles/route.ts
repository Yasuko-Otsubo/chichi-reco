import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import {
  ProfileCreateRequest,
  ProfileResponse,
  ProfileUpdateRequest,
  toProfileFields,
} from "@/types/profiles";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body: ProfileCreateRequest = await request.json();
    const user = await getAuthenticatedUser(request);
    const { name, targetWeight, height } = body;

    const data = await prisma.profile.create({
      data: {
        name,
        supabaseUserId: user.id,
        targetWeight,
        height,
      },
    });

    const response: ProfileResponse = {
      status: "OK",
      message: "記録しました",
      profiles: [toProfileFields(data)],
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ProfileResponse = {
      status: "NG",
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(response, { status: 400 });
  }
};

  export const GET = async (request: NextRequest) => {
    try {
      const user = await getAuthenticatedUser(request);

      const profile = await prisma.profile.findFirst({
        where: { supabaseUserId: user.id },
      });

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
    const user = await getAuthenticatedUser(request);

    type PrismaProfileUpdate = {
      name?: string;
      targetWeight?: number;
      height?: number;
    }

    try {
      const body: ProfileUpdateRequest = await request.json();
      const { name, targetWeight, height } = body;

      const updateData: PrismaProfileUpdate = {};

      if (name !== undefined) updateData.name = name;
      if (targetWeight !== undefined) updateData.targetWeight = targetWeight;
      if (height !== undefined) updateData.height = height;

      const profile = await prisma.profile.findFirst({
        where: { supabaseUserId: user.id },
      });

      if (!profile) {
        return NextResponse.json(
          { status: "NG", message: "プロフィールが見つかりません" },
          { status: 404 },
        );
      }


      const updatedProfile = await prisma.profile.update({
        where: { supabaseUserId: user.id },
        data: updateData,
      });

      const response: ProfileResponse = {
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