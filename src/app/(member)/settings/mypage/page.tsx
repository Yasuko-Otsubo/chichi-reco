"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  ProfileFields,
  ProfileResponse,
  UpdateProfileRequest,
} from "@/types/profiles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, UseFormHandleSubmit } from "react-hook-form";
import { MyPageForm } from "./_components/MyPageForm";
import { MyPageFormValues } from "@/types/form";

export default function Page() {
  const router = useRouter();
  const { session, token } = useSupabaseSession();

  const defaultValues = {
    name: "",
    height: "",
    targetWeight: "",
  };

  const [profile, setProfile] = useState<ProfileFields | null>(null);
  const { register, handleSubmit, reset } = useForm<MyPageFormValues>({
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProfile = async () => {
      if (!token) return;
      const res = await fetch(`/api/profiles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data: ProfileResponse = await res.json();
      if (data.profiles) setProfile(data.profiles[0]);
    };

    useEffect(() => {
      if (!token) return;
      fetchProfile();
    }, [token]);

    useEffect(() => {
      if (profile) {
        reset({
          name: profile.name ?? "",
          height: profile.height?.toString() ?? "",
          targetWeight: profile.targetWeight?.toString() ?? "",
          email: session?.user.email ?? "",
        });
      }
    }, [profile, session]);

  // ===== PUT =====
  const onSubmit = async (values: MyPageFormValues) => {
    if (!token) return;

    if (!values.name && !values.height && !values.targetWeight) {
      alert("いづれかの項目を入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      const body: UpdateProfileRequest = {
        name: values.name || null,
        height: values.height ? Number(values.height) : null,
        targetWeight: values.targetWeight ? Number(values.targetWeight) : null,
      };

      const res = await fetch(`/api/profiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

    if (res.ok) {
      const data = await res.json();
      alert(data.message);
      await fetchProfile();
      return true;
    } else {
      alert("更新に失敗しました");
      return false;
    }

    } finally {
      setIsSubmitting(false);
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
