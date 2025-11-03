import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export const POST = async ( request: Request/*, context: any*/ ) => {
  try  {
    const body = await request.json()
    const { id, name, supabase_user_id, height, target_weight} = body

    const data = await prisma.profiles.create({
      data: {
        id,
        name,
        supabase_user_id,
        height,
        target_weight
      },
    })
    return NextResponse.json ({
      status: 'OK',
      message: '記録しました',
      id: data.id,
    })
  } catch(error) {
    if(error instanceof Error) {
      return NextResponse.json({ status: error.message}, { status: 400 })
    }  
  }
};

  export const GET = async (request: NextRequest) => {
    try {
      const profiles = await prisma.profiles.findMany()
      return NextResponse.json({ status: 'OK', profiles}, { status: 200})
    } catch (error) {
      if(error instanceof Error) {
        return NextResponse.json({status: error.message}, { status: 400})
      }
    }
  };


  export const PUT = async (
    request: NextRequest, 
    { params } : { params : { id: string }},
  ) => {
    const { id } = params;    
    const { name, email, password, height, target_weight } = await request.json();

    try {
      const supabase = createServerComponentClient({ cookies });

      if (email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if(emailError) throw new Error(`メール更新失敗: ${emailError.message}`);
      }

      if (password) {
        const{ error: passwordError } = await supabase.auth.updateUser({ password });
        if(passwordError) throw new Error(`パスワード更新失敗: ${passwordError.message}`);
      }

      const profile = await prisma.profiles.update({
        where: { 
          id: parseInt(id),
         },
        data: {
          name,
          height,
          target_weight,
        },
      })

      return NextResponse.json({status: 'OK', profile}, { status: 200})
    } catch (error) {
      if (error instanceof Error) 
        return NextResponse.json({ status: error.message }, { status: 400})
    }
  } 
