import { TodayFormData } from "@/app/(member)/today/_components/TodayForm";
import { useSupabaseSession } from "../useSupabaseSession"

export const useRecordActions = () => {
  const { token } = useSupabaseSession();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  const buildRequestBody = (data: TodayFormData) => ({
    date: data.date,
    weight: data.weight !== "" ? Number(data.weight): null,
    steps: data.steps !== "" ? Number(data.steps): null,
    memo: data.memo !== "" ? data.memo: null,
  });

  //create
  const createRecord = async (data: TodayFormData) => {
    const res = await fetch("/api/records", {
      method: "POST",
      headers,
      body: JSON.stringify(buildRequestBody(data)),
    });
  return res;
  };

  //update
  const updateRecord = async (id: string, data: TodayFormData) => {
    const res = await fetch(`/api/records/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(buildRequestBody(data)),
    });
    return res;
  };

  //delete
  const deleteRecord = async (id: string) => {
    const res = await fetch(`/api/records/${id}`, {
      method: "DELETE",
      headers,
    });
    return res;
  }
  return { createRecord, updateRecord, deleteRecord };
}