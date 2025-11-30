import { getSupabaseClient } from "@/utils/cookie"


export const getAuthenticatedUser = async () => {
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if(error || !user) throw new Error("認証されていません");
  return user;
}