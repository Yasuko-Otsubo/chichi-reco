import { useSupabaseSession } from "../useSupabaseSession"
import { TodayFormData } from "@/app/(member)/today/[date]/TodayForm";

export const useRecordCreate = () => {
  const { token } = useSupabaseSession();

  const createRecord = async (data: TodayFormData) => {
    const res = await fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: data.date,
        weight: data.weight !== "" ? Number(data.weight): null,
        steps: data.steps !== "" ? Number(data.steps): null,
        memo: data.memo !== "" ? data.memo: null,
      }),
    });
  return res;
  };

  const updateRecord = async (id: string, data: TodayFormData) => {
    const res = await fetch(`/api/records/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: data.date,
        weight: data.weight !== "" ? Number(data.weight): null,
        steps: data.steps !== "" ? Number(data.steps): null,
        memo: data.memo !== "" ? data.memo: null,
      }),
    });
    return res;
  }
  return { createRecord, updateRecord };
}