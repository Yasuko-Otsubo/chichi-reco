"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  ProfileFields,
  ProfileResponse,
  UpdateProfileRequest,
} from "@/types/profiles";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MyPageForm } from "./_components/MyPageForm";
import { MyPageFormValues } from "@/types/form";
import { supabase } from "@/app/_libs/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const { session, token } = useSupabaseSession();
  const router = useRouter();

  const isGuest = session?.user.email === process.env.NEXT_PUBLIC_GUEST_EMAIL;
  useEffect(() => {
    if (isGuest) {
      router.replace("/settings");
    }
  }, [isGuest, router]);

  const defaultValues = {
    name: "",
    height: "",
    targetWeight: "",
  };

  const [profile, setProfile] = useState<ProfileFields | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MyPageFormValues>({
    defaultValues,
  });

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`/api/profiles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: ProfileResponse = await res.json();
    if (data.profiles) {
      setProfile(data.profiles[0]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchProfile();
  }, [token, fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        height: profile.height?.toString() ?? "",
        targetWeight: profile.targetWeight?.toString() ?? "",
        email: session?.user.email ?? "",
      });
    }
  }, [profile, session, reset]);

  // ===== PUT =====
  const onSubmit = async (values: MyPageFormValues) => {
    if (!token) return;

    if (!values.name && !values.height && !values.targetWeight) {
      toast.error("いずれかの項目を入力してください");
      return;
    }

    // email更新
    if (values.email) {
      await supabase.auth.updateUser({ email: values.email });
    }

    // password更新
    if (values.password) {
      await supabase.auth.updateUser({ password: values.password });
    }

    try {
      const body: UpdateProfileRequest = {
        name: values.name || null,
        height: values.height ? Number(values.height) : null,
        targetWeight: values.targetWeight ? Number(values.targetWeight) : null,
      };

      const res = await fetch(`/api/profiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        await fetchProfile();
        return true;
      } else {
        toast.error("変更はありませんでした");
        return false;
      }
    } catch {
      toast.error("更新に失敗しました");
    }
  };

  return (
    <MyPageForm
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      disabled={isSubmitting}
      session={session}
      profile={profile}
    />
  );
}
