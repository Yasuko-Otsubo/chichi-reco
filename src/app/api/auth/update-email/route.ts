import { supabase } from "@/app/_libs/supabase";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { status: "NG", message: "認証されていません"},
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      throw new Error("メールアドレスが指定されていません");
    }

    if (!email.includes("@")) {
      throw new Error("有効なメールアドレスを入力してください");
    }

    const  { error } = await supabase.auth.updateUser({ email });

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
    return NextResponse.json(response, { status: 400 })
  }
};