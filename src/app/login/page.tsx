"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "../_libs/supabase";
import toast from "react-hot-toast";

type LoginInput = {
  email: string;
  password: string;
};

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
      toast.error("ログインに失敗しました");
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
