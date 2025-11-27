export type ProfileFields = {
  name: string;
  supabase_user_id: string;
  height: number;
  target_weight: number;
}

export type ProfileResponse = {
  status: string;
  message: string;
  id?: number;
}