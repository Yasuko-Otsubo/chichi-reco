"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "../_libs/supabase";

type LoginInput = {
  email: string;
  password: string;
};

const GUEST_EMAIL = process.env.NEXT_PUBLIC_GUEST_EMAIL!;
const GUEST_PASSWORD = process.env.NEXT_PUBLIC_GUEST_PASSWORD!;

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert("ログインに失敗しました");
      return;
    }
    router.replace("/today");
  };

  // ゲストログイン処理
  const handleGuestLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    });

    if (error) {
      alert("ゲストログインに失敗しました");
      return;
    }
    router.replace("/today");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-[100px] w-full bg-bgColor ">
      <h1 className="text-xl mb-8">ログイン</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
          className="w-[350px] bg-white rounded-[15px] p-10 x-auto space-y-4 "
      >
        <Input
          label="メールアドレス"
          labelClassName="text-center block text-sm"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register("email", { required: "メールアドレスは必須です" })}
        />

        <Input
          label="パスワード"
          labelClassName="text-center block text-sm"
          type="password"
          placeholder="••••••••"
          className="bg-white mb-6"
          error={errors.password?.message}
          {...register("password", { required: "パスワードは必須です" })}
        />

        <Button
          variant="member"
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          ログイン
        </Button>
      </form>
    </div>
  );
}
