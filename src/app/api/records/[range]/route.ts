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
    const type = searchParams.get("type")

    const now = new Date();
    let start: Date;

    start = new Date(now)

    switch(type) {
      case "week":
        start.setDate(start.getDate() -6)
        break;
      
      case "month":
        start.setMonth(start.getMonth() - 1)
        break;

      case "half-year":
        start.setMonth(start.getMonth() - 6)
        break;

      case "year":
        start.setFullYear(start.getFullYear() - 1)
        break;

      case "all":
        start.setFullYear(start.getFullYear() - 3)
        break;

    }
  }
}