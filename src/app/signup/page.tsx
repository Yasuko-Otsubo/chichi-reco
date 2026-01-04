'use client'

import { supabase } from '@/utils/supabase'
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options : {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if(error) {
      alert ('登録失敗')
    } else {
      setEmail('');
      setPassword('');
      alert('確認メールを送りました');
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-[100px] w-full bg-[#a2dae7]  mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-[50px] p-10 space-y-4 w-full max-w-[400px]">
      <Input
          label="メールアドレス"
          type="email"
          placeholder="name@company.com"
          required
          className='bg-white'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="パスワード"
          type="password"
          placeholder="••••••••"
          required
          className='bg-white'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" fullWidth>
          登録
        </Button>

      </form>
    </div>
  )
}
