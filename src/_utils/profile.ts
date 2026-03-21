import { prisma } from "../app/_libs/prisma";

export const getProfileByUserId = async (userId: string) => {
  const profile = await prisma.profile.findFirst({
    where: { supabaseUserId: userId },
  });

  if (!profile) throw new Error("Profile not found");
  return profile;
};
