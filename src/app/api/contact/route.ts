import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, email, content } = body;

    const data = await prisma.contact.create({
      data: {
        name,
        email,
        content,
      },
    });
    return NextResponse.json({
      status: "OK",
      message: "送信しました",
      id: data.id,
    });
  } catch (error) {
    if ( error instanceof Error) {
      return NextResponse.json({ status: error.message}, { status: 400 })
    }
  }
};