import { getCurrentUser } from "@/utils/supabase";
import { NextRequest } from "next/server";

export const getAuthenticatedUser = async (request: NextRequest) => {
  const { currentUser, error } = await getCurrentUser(request);
  if(error || !currentUser?.user ) throw new Error("認証されていません");
  return currentUser.user;
}

const requireUser = async(request: NextRequest) => {
  const { currentUser, error } = await getCurrentUser(request);
  if(error || !currentUser?.user) {
    throw new Error("認証されていません");
  }
  return currentUser.user;
}