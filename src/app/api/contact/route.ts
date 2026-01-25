import { NextResponse } from "next/server";
import { ContactFields, ContactResponse } from "@/types/contact";
import { prisma } from "@/app/_libs/prisma";

export const POST = async (request: Request) => {
  try {
    const body: ContactFields = await request.json();
    const { name, email, content } = body;

    const data = await prisma.contact.create({
      data: { name, email, content },
    });

    const response: ContactResponse = {
      status: "OK",
      message: "送信しました",
      id: data.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error) {
      const response: ContactResponse = {
        status: "NG",
        message: error.message,
      };
      return NextResponse.json(response, { status: 400 });
    }
  }
};

export const GET = async () => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { id: "desc" },
    });
    
    return NextResponse.json(
      { status: "OK", message: "取得しました", content: contacts },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "NG", message: "エラーが発生しました"},
      { status: 500 }
    );
  }
};
