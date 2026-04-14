"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ContactFormValues } from "@/types/form";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function HowtoPage() {
  const { token } = useSupabaseSession();
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  const onConfirm = handleSubmit(() => {
    setIsConfirming(true);
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (!token) return;

    if (!values.name || !values.email || !values.content) {
      alert("すべての項目を入力してください");
      return;
    }

    try {
      const res = await fetch(`/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        return true;
      }
    } catch (error) {
      alert("送信に失敗しました");
    }
  };

  return (
    <>
      <form onSubmit={onConfirm}>
        <div>
          <label>名前</label>
          {isConfirming ? (
            <span>{getValues("name")}</span>
          ) : (
            <input className="border-2 " type="text" {...register("name")} />
          )}
        </div>
        <div>
          <label>メールアドレス</label>
          {isConfirming ? (
            <span>{getValues("email")}</span>
          ) : (
            <input className="border-2 " type="text" {...register("email")} />
          )}
        </div>
        <div>
          <label>質問内容</label>
          {isConfirming ? (
            <span>{getValues("content")}</span>
          ) : (
            <input className="border-2 " type="text" {...register("content")} />
          )}
        </div>
        {isConfirming ? (
          <>
            <button
              type="button"
              className="border-2"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              送信する
            </button>
            <button type="button" onClick={() => setIsConfirming(false)}>
            戻る
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="border-2"
            disabled={isSubmitting}
          >
            確認する
          </button>
        )}
      </form>
    </>
  );
}
