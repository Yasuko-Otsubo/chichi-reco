import { supabase } from "@/app/_libs/supabase";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    await getAuthenticatedUser(request);

    const body = await request.json();
    const { password } = body;

    if (!password) {
      throw new Error("パスワードが指定されていません");
    }

    if (password.length < 6) {
      throw new Error("パスワードは6文字以上である必要があります")
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      throw new Error("パスワードは英語と数字を含める必要があります");
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw new Error(error.message);
    }

    const response = {
      status: "OK",
      message: "記録しました"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response = {
      status: "NG",
      message: error instanceof Error ? error.message: "Unknown error",
    };
    return NextResponse.json(response, { status: 400})
  }
}