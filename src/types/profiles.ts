export type ProfileFields = {
  id: number;
  name: string;
  supabase_user_id: string;
  height: number;
  target_weight: number;
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
  target_weight: number;
};

//更新用
export type ProfileUpdateRequest = {
  name?: string;
  email?: string;
  password?: string;
  height?: number;
  target_weight?: number;
}