import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/utils/supabase";
import { error } from "console";

const prisma = new PrismaClient();

export const PUT = async (

  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { name, email, password, height, target_weight, memo } =
    await request.json();

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

    const token =  request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token);
  if(error) 
    return NextResponse.json({status:  error.message} , { status: 400 })



  try {

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
      where: { id: idNumber },
      data: {
        name,
        height,
        target_weight,
      },
    });

    return NextResponse.json({ status: "OK", profile }, { status: 202 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
