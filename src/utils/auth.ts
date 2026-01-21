import { getCurrentUser, supabase } from "@/utils/supabase";
import { NextRequest } from "next/server";

export const getAuthenticatedUser = async (request: NextRequest) => {
  const { currentUser, error } = await getCurrentUser(request);
  if(error || !currentUser?.user ) throw new Error("認証されていません");
  return currentUser.user;
}

export const requireUser = async(request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';
  const { data, error } = await supabase.auth.getUser(token);

  if(error || !data.user) {
    throw new Error('認証されていません');
  }

  return data.user;
}