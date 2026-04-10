"use client";
import { MyPageFormValues } from "@/types/form";
import { ProfileFields } from "@/types/profiles";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<MyPageFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  disabled: boolean;
  session: Session | null;
  profile: ProfileFields | null;
}

export const MyPageForm: React.FC<Props> = ({
  register,
  onSubmit,
  disabled,
  session,
  profile,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <form onSubmit={onSubmit}>
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
            <span>{"＊＊＊＊＊＊"}</span>
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
        <button type="submit" disabled={disabled}>
          更新する
        </button>
      </form>
    </>
  );
};
