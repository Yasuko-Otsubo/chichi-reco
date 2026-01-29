import { prisma } from "@/app/_libs/prisma";
import { getAuthenticatedUser } from "@/app/_libs/supabase/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request);

    const profile = await prisma.profile.findFirst({
      where: { supabaseUserId: user.id },
    });

    if(!profile) {
      return NextResponse.json(
        { status: "NG", message: "Profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
  }
}