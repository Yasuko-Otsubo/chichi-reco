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
  session: Session | null | undefined;
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
            <input className="border-2" type="text" placeholder={profile?.name ?? ""}{...register("name")} />
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
            <input className="border-2" type="text" placeholder={profile?.height?.toString() ?? ""}{...register("height")} />
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
              placeholder={profile?.targetWeight?.toString() ?? ""}
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
