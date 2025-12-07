import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  ProfileFields,
  ProfileResponse,
  ProfileUpdateRequest,
} from "@/types/profiles";
import { requireUser } from "@/utils/auth";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest /*, context: any*/) => {
  try {
    const user = await requireUser(request);
    const body: ProfileFields = await request.json();
    const { name, height, target_weight } = body;

    const data = await prisma.profiles.create({
      data: {
        name,
        supabase_user_id: user.id,
        height,
        target_weight,
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const user = await requireUser(request);
    const body: ProfileUpdateRequest = await request.json();
    const { name, email, password, height, target_weight } = body;

    if (email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) throw new Error(`メール更新失敗: ${emailError.message}`);
    }

    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });
      if (passwordError)
        throw new Error(`パスワード更新失敗: ${passwordError.message}`);
    }
    const profile = await prisma.profiles.update({
      where: { id: Number(id), supabase_user_id: user.id },
      data: {
        name,
        height,
        target_weight,
      },
    });

    const response: ProfileResponse = {
      status: "OK",
      message: "プロフィールを更新しました",
      profiles: [profile],
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
