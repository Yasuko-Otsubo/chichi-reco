import { supabase } from '@/app/_libs/supabase';
import { NextRequest } from 'next/server';

/** requestからtokenを取り出して認証済みユーザーを返す */
export const getAuthenticatedUser = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization") || "";

  if(!authHeader) {
    throw new Error("Authorizationヘッダーがありません")
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const { data, error } = await supabase.auth.getUser(token);

  if(error || !data.user){
    throw new Error("認証されていません")
  }
  return data.user;
};

