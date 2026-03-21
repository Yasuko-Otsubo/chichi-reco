import { NextRequest, NextResponse } from "next/server";
import { ContactCreateRequest, ContactCreateResponse } from "@/types/contact";
import { prisma } from "@/app/_libs/prisma";
import { ApiResponse } from "@/types/api";

export const POST = async (request: NextRequest) => {
  try {
    const body: ContactCreateRequest = await request.json();
    const { name, email, content } = body;

    if (!name || !email || !content) {
      throw new Error("すべての項目を記入してください");
    }

    if (!email.includes("@")) {
      throw new Error("有効なメールアドレスを入力してください");
    }

    const data = await prisma.contact.create({
      data: { name, email, content },
    });

    const response: ContactCreateResponse = {
      status: "OK",
      message: "送信しました",
      id: data.id,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse>(
        { status: "NG", message: error.message },
        { status: 400 },
      );
    }
  }
};
