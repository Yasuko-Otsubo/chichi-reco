import { Profile as PrismaProfile } from "@/app/generated/prisma/client";
//レスポンス用
export type ProfileFields = {
  id: number;
  name: string | null;
  supabaseUserId: string;
  height: number | null;
  targetWeight: number | null;
};

//POST用
export type ProfileCreateRequest = {
  name: string | null;
  height: number | null;
  targetWeight: number | null;
};

//DB ⇒ APIの変換
export const toProfileFields = (profile: PrismaProfile): ProfileFields => ({
  id: profile.id,
  name: profile.name,
  supabaseUserId: profile.supabaseUserId,
  height: profile.height,
  targetWeight: profile.targetWeight,

})

export type ProfileResponse = {
  status: "OK" | "NG";
  message: string;
  profiles?: ProfileFields[];
};


//更新用
export type ProfileUpdateRequest = {
  name?: string;
  email?: string;
  password?: string;
  height?: number;
  targetWeight?: number;
}