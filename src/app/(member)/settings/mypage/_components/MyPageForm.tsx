"use client";
import { MyPageFormValues } from "@/types/form";
import { ProfileFields } from "@/types/profiles";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<MyPageFormValues>;
  handleSubmit: UseFormHandleSubmit<MyPageFormValues>;
  onSubmit: (values: MyPageFormValues) => Promise<boolean | undefined>;
  disabled: boolean;
  session: Session | null | undefined;
  profile: ProfileFields | null;
}

export const MyPageForm: React.FC<Props> = ({
  register,
  handleSubmit,
  onSubmit,
  disabled,
  session,
  profile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
    await handleSubmit(onSubmit)(e);
    setIsEditing(false);
  };

  const inputClass =
    "w-[70%] text-center m-auto border border-[var(--color-textColor)] rounded-[10px] py-1 px-2";
  const btnClass =
    "hover:bg-[var(--color-bgColor)] bg-decisionBtn border border-[var(--color-boxColor)]  rounded-[15px] w-[70%] p-2";

  return (
    <>
      <h1 className="text-xl text-center py-6">マイページ</h1>
      <div className="bg-white rounded-[15px] py-8 px-4 mb-4">
        <form onSubmit={handleFormSubmit} className="text-center">
          <div className="flex flex-col mb-4">
            <label>名前</label>
            {isEditing ? (
              <input className={inputClass} type="text" {...register("name")} />
            ) : (
              <span>{profile?.name}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label>メールアドレス</label>
            {isEditing ? (
              <input
                className={inputClass}
                type="text"
                {...register("email")}
              />
            ) : (
              <span>{session?.user.email}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label>パスワード</label>
            {isEditing ? (
              <input
                className={inputClass}
                type="text"
                {...register("password")}
              />
            ) : (
              <span>{"　＊＊＊＊＊＊　"}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label>身長</label>
            {isEditing ? (
              <div className="flex items-center w-[70%] mx-auto">
                {" "}
                <input
                  className="flex-1 text-center border border-[var(--color-textColor)] rounded-[10px] py-1 px-2"
                  type="text"
                  {...register("height")}
                />
                <span className="ml-2">cm</span>
              </div>
            ) : (
              <span>{profile?.height}cm</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label>目標体重</label>
            {isEditing ? (
              <div className="flex items-center w-[70%] mx-auto">
                <input
                  className="flex-1 text-center border border-[var(--color-textColor)] rounded-[10px] py-1 px-2"
                  type="text"
                  {...register("targetWeight")}
                />
                <span className="ml-2">kg</span>
              </div>
            ) : (
              <span>{profile?.targetWeight}kg</span>
            )}
          </div>
          {isEditing ? (
            <div className="flex justify-center gap-4 w-[70%] m-auto mt-12">
              <button className={btnClass} type="submit" disabled={disabled}>
                {" "}
                更新する
              </button>
              <button
                type="button"
                className={btnClass}
                onClick={() => setIsEditing(false)}
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              className={btnClass}
              type="button"
              onClick={() => setIsEditing(true)}
            >
              変更する
            </button>
          )}
        </form>
      </div>
    </>
  );
};
