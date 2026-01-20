import { NextRequest, NextResponse } from "next/server";
import {
  ProfileCreateRequest,
  ProfileFields,
  ProfileResponse,
} from "@/types/profiles";
import { requireUser } from "@/utils/auth";
import { prisma } from "@/lib/prisma";


export const POST = async (request: NextRequest /*, context: any*/) => {
  try {
    const user = await requireUser(request);
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
    const user = await requireUser(request);

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
