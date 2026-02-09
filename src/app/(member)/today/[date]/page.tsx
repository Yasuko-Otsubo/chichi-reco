import { supabase } from "@/app/_libs/supabase";
import TodayForm from "./TodayForm";

export default async function Page ({ params }: { params: { date: string }}) {
  const date = params.date;

  const { data: record, error } = await supabase
  .from("records")
  .select("*")
  .eq("date", date)
  .single();

  if (error) {
  console.error(error);
}


  //新規 or 編集の判定
  const isEdit = !!record;

  const defaultValues = record ?? {
    date,
    memo: "",
    condition: "",
  };

  return (
    <TodayForm
      defaultValues={defaultValues}
      isEdit = { isEdit }
      recordId = { record?.id ?? null }
      />
  );
}