import { NextRequest, NextResponse } from "next/server";
import {
  ProfileCreateRequest,
  ProfileFields,
  ProfileResponse,
} from "@/types/profiles";
import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";

export const POST = async (request: NextRequest /*, context: any*/) => {
  try {
    const user = await getAuthenticatedUser(request);
    const body: ProfileCreateRequest = await request.json();
    const { name, height, targetWeight } = body;

    const data = await prisma.profile.upsert({
      where: { supabaseUserId: user.id },
      update: {
        name,
        height,
        targetWeight,
      },
      create: {
        name,
        height,
        targetWeight,
        supabaseUserId: user.id,
      },
    });

    const response: ProfileResponse = {
      status: "OK",
      message: "記録しました",
      profiles: [data],
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

export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    const response: ProfileResponse = {
      status: "OK",
      message: "取得しました",
      profiles: profile ? [profile as ProfileFields] : [],
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
