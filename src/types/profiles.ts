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

export type ProfileUpdateRequest = {
  name?: string;
  height?: number;
  target_weight?: number;
};
