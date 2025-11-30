// src/lib/cookie.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const getSupabaseClient = () => {
  return createServerComponentClient({ cookies });
};