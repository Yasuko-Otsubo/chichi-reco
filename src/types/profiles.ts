export type ProfileFields = {
  id: number;
  name?: string;
  supabaseUserId: string;
  height?: number;
  targetWeight?: number;
};

export type ProfileResponse = {
  status: "OK" | "NG";
  message: string;
  profiles?: ProfileFields[];
};
//新規作成用
export type ProfileCreateRequest = {
  name: string;
  height: number;
  targetWeight: number;
};

//更新用
export type ProfileUpdateRequest = {
  name?: string;
  email?: string;
  password?: string;
  height?: number;
  targetWeight?: number;
}