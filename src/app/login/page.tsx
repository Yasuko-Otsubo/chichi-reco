"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "../_libs/supabase";

type LoginInput  = {
  email: string;
  password: string;
};

export default function Page (){
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
      router.replace("/today")
  };

  return (
    <div className="flex justify-center pt-[240px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-[400px]"
      >
        <Input
          label="メールアドレス"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register("email", { required: "メールアドレスは必須です" })}
        />

        <Input
          label="パスワード"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "パスワードは必須です" })}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          ログイン
        </Button>
        
      </form>
    </div>
  );
}
