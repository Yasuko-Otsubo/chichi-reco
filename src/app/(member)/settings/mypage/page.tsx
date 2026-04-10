"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  ProfileFields,
  ProfileResponse,
  UpdateProfileRequest,
} from "@/types/profiles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit } = useForm<MyPageFormValues>({
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      const res = await fetch(`/api/profiles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data: ProfileResponse = await res.json();
      if (data.profiles) setProfile(data.profiles[0]);
    };
    fetchProfile();
  }, [token]);

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
        alert("更新しました");
      } else {
        alert("更新に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <MyPageForm
      register={register}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isSubmitting}
      session={session}
      profile={profile}
    />
  );
}
