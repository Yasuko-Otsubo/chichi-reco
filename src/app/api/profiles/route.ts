import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  ProfileFields,
  ProfileResponse,
} from "@/types/profiles";
import { requireUser } from "@/utils/auth";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest /*, context: any*/) => {
  try {
    const user = await requireUser(request);
    const body: ProfileFields = await request.json();
    const { name, height, target_weight } = body;

    const data = await prisma.profiles.upsert({
      where: {supabase_user_id: user.id},
      updata: {
        name,
        height,
        target_weight,
      },
      create{
        name,
        hei
      }
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

    const profile = await prisma.profiles.findUnique({
      where: { supabase_user_id: user.id },
    });

    const response: ProfileResponse = {
      status: "OK",
      message: "取得しました",
      profiles: profile ? [profile] : [],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const response: ProfileResponse = {status: "NG", message: error.message};
      return NextResponse.json(response, { status: 400 });
    }
  }
};
