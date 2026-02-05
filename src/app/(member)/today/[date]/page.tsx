import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { redirect } from "next/navigation";

export default async function Page(
  { params }: { params: { date: string }}
)  {
  const date = params.date;

  //supabaseからuser取得
  const {
     data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    //Profile取得
    const profile = await prisma.profile.findUniqueOrThrow({
      where: { supabaseUserId: user.id },
    });

    

    //Recordを取得
    const record = await prisma.record.findFirst({
      where: {
        profileId: profile.id,
        date: date,
      }
    })
} 