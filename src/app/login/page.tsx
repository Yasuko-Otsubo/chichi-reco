'use client'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type LoginInput  = {
  email: string;
  password: string;
}

export default function LoginForm (){
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>()

  const onSubmit = async (data: LoginInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/')
    }
  }

  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
 <Input
          label="メールアドレス"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email', { required: 'メールアドレスは必須です' })}
        />

        <Input
          label="パスワード"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'パスワードは必須です' })}
        />

        <Button type="submit" fullWidth>
          ログイン
        </Button>

      </form>
    </div>
  )
}
