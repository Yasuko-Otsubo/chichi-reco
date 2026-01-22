import { supabase } from '@/app/_libs/supabase';
import { NextRequest } from 'next/server';

/** APIリクエストのtokenの検証。検証できればログインユーザー（Supabase）情報を返す */
export const getCurrentUser = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token)

  return { currentUser: data, error }
}

export const getAuthenticatedUser = async (request: NextRequest) => {
  const { currentUser, error } = await getCurrentUser(request);
  if (error || !currentUser?.user) throw new Error("認証されていません");
  return currentUser.user;
};

