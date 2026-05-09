import type { Profile as PrismaProfile } from "@/app/generated/prisma/client";

export type UpdateProfileRequest = {
  name?: string | null;
  height?: number | null;
  targetWeight?: number | null;
};

export type ProfileFields = {
  id: number;
  name: string | null;
  supabaseUserId: string;
  height: number | null;
  targetWeight: number | null;
};

export type UpdateProfileResponse = {
  status: "OK";
  message: string;
  profiles: ProfileFields[];
};

export const toProfileFields = (profile: PrismaProfile): ProfileFields => ({
  id: profile.id,
  name: profile.name,
  supabaseUserId: profile.supabaseUserId,
  height: profile.height,
  targetWeight: profile.targetWeight,
});

export type ProfileResponse = {
  status: "OK" | "NG";
  message: string;
  profiles?: ProfileFields[];
};

export type PrismaUpdateProfile = {
  name?: string | null;
  height?: number | null;
  targetWeight?: number | null;
};
