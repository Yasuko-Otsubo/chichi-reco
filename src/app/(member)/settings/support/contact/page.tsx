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
    formState: { isSubmitting, errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  const onConfirm = handleSubmit((values) => {
    if (!values.name || !values.email || !values.content) {
      alert("すべての項目を入力してください");
      return;
    }
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

  const inputClass =
    "border border-[var(--color-textColor)] p-2 rounded-[5px] ";
  const btnClass =
    "hover:bg-[var(--color-bgColor)] bg-decisionBtn border border-[var(--color-boxColor)]  rounded-[15px] w-[70%] p-2";

  return (
    <>
      <h1 className="text-xl text-center py-6">お問い合わせ</h1>
      <div className=" bg-white rounded-[15px] mb-6 p-2 py-6">
        <form onSubmit={onConfirm}>
          <div className="w-[80%] mx-auto flex flex-col text-center">
            <label>名前</label>
            {isConfirming ? (
              <span>{getValues("name")}</span>
            ) : (
              <input className={inputClass} type="text" {...register("name")} />
            )}
          </div>
          <div className="w-[80%] mx-auto flex flex-col text-center">
            <label>メールアドレス</label>
            {isConfirming ? (
              <span>{getValues("email")}</span>
            ) : (
              <>
                <input
                  className={inputClass}
                  type="text"
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "メールアドレスの形式が正しくありません",
                    },
                  })}
                />

                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="w-[80%] mx-auto flex flex-col text-center">
            <label>質問内容</label>
            {isConfirming ? (
              <span>{getValues("content")}</span>
            ) : (
              <input
                className={inputClass}
                type="text"
                {...register("content")}
              />
            )}
          </div>

          {isConfirming ? (
            <>
              <div className="flex justify-center gap-4 w-[70%] m-auto mt-12">
                <button
                  type="button"
                  className={btnClass}
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  送信する
                </button>
                <button
                  type="button"
                  className={btnClass}
                  onClick={() => setIsConfirming(false)}
                >
                  戻る
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center mx-auto mt-12">
              <button
                type="submit"
                className={btnClass}
                disabled={isSubmitting}
              >
                確認する
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
