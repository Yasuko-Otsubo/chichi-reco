import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import { ProfileResponse, ProfileUpdateRequest } from "@/types/profiles";
import { prisma } from "@/app/_libs/prisma";

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);

  if (error)
    return NextResponse.json(
      { status: "NG", message: error.message },
      { status: 401 },
    );
  const user = data.user;
  try {
    const body: ProfileUpdateRequest = await request.json();
    const { name, email, password, height, targetWeight } = body;

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

    const updateData: Partial<ProfileUpdateRequest> = {};
    if (name !== undefined) updateData.name = name;
    if (height !== undefined) updateData.height = height;
    if (targetWeight !== undefined) updateData.targetWeight = targetWeight;

    const profile = await prisma.profile.update({
      where: { id: Number(id), supabaseUserId: user.id },
      data: updateData,
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
