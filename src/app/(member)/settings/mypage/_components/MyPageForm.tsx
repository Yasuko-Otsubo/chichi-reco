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
    const handleFormSubmit = async(e?: React.BaseSyntheticEvent) => {
      await handleSubmit(onSubmit)(e);
      setIsEditing(false);
    };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>名前</label>
          {isEditing ? (
            <input className="border-2" type="text" {...register("name")} />
          ) : (
            <span>{profile?.name}</span>
          )}
        </div>
        <div>
          <label>メールアドレス</label>
          {isEditing ? (
            <input className="border-2" type="text" {...register("email")} />
          ) : (
            <span>{session?.user.email}</span>
          )}
        </div>
        <div>
          <label>パスワード</label>
          {isEditing ? (
            <input className="border-2" type="text" {...register("password")} />
          ) : (
            <span>{"　＊＊＊＊＊＊　"}</span>
          )}
        </div>
        <div>
          <label>身長</label>
          {isEditing ? (
            <input className="border-2" type="text" {...register("height")} />
          ) : (
            <span>{profile?.height}</span>
          )}
        </div>
        <div>
          <label>目標体重</label>
          {isEditing ? (
            <input
              className="border-2"
              type="text"
              {...register("targetWeight")}
            />
          ) : (
            <span>{profile?.targetWeight}</span>
          )}
        </div>
        {isEditing ? (
          <>        
          <button className="border-2 p-2 m-2" type="submit" disabled={disabled}>          更新する
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>キャンセル</button>

          </>

        ) : (
          <button className="border-2 p-2 m-2" type="button" onClick={() => setIsEditing(true)}>変更する</button>
        )}
      </form>
    </>
  );
};
