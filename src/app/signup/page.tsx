"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "../_libs/supabase";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type SignupInput = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>();

  const onSubmit = async (data: SignupInput) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    });

    if (error) {
      alert("登録に失敗しました");
      return;
    } else {
      alert("確認メールを送りました");
      router.replace("/");
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start pt-[100px] w-full bg-bgColor ">
        <h1 className="text-2xl">新規登録</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[15px] p-10 space-y-4 w-full max-w-[400px]"
        >
          <Input
            label="メールアドレス"
            type="email"
            placeholder="name@company.com"
            className="bg-white"
            error={errors.email?.message}
            {...register("email", { required: "メールアドレスは必須です" })}
          />

          <Input
            label="パスワード"
            type="password"
            placeholder="••••••••"
            className="bg-white"
            error={errors.password?.message}
            {...register("password", { required: "パスワードは必須です" })}
          />

          <Button type="submit" fullWidth disabled={isSubmitting}>
            登録
          </Button>
        </form>
      </div>
    </>
  );
}
