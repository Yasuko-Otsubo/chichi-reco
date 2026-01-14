import { NextResponse } from "next/server";
import { ContactFields, ContactResponse } from "@/types/contact";
import { prisma } from "@/lib/prisma";


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

    return NextResponse.json( response );
  } catch (error) {
    if ( error instanceof Error) {
        const response: ContactResponse = { status: "NG" , message: error.message }
      return NextResponse.json(response, { status: 400 })
    }
  }
};