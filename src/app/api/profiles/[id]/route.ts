import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { ProfileResponse, ProfileUpdateRequest } from "@/types/profiles";

const prisma = new PrismaClient();

export const PUT = async (

  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  const token = request.headers.get('Authorization') ?? ''
  const { data , error } = await supabase.auth.getUser(token);

  if(error) 
    return NextResponse.json({status:  error.message} , { status: 401 })
  const user = data.user;
  try {

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

    const updateData: Partial<ProfileUpdateRequest> = {};
    if (name !== undefined) updateData.name = name;
    if (height !== undefined) updateData.height = height;
    if (target_weight !== undefined) updateData.target_weight = target_weight;

    const profile = await prisma.profiles.update({
      where: { id: Number(id), supabase_user_id: user.id },
      data: updateData,
    });

    const response: ProfileResponse = {
      status: "OK",
      message: "プロフィールを更新しました",
      profiles: [profile],
    }

    return NextResponse.json(response,  { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const response: ProfileResponse = {
        status: "NG",
        message: error.message,
      };
      return NextResponse.json(response, {status: 400});
    }
  }
};
