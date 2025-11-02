import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
  }
