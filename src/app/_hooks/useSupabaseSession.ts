import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../_libs/supabase";

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
    };

    fetcher();
  }, [pathname]);

  return { session, isLoding: session === undefined, token };
};
