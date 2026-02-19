import { supabase } from "@/app/_libs/supabase";
import TodayForm, { TodayFormData } from "../_components/TodayForm";

export default async function Page({ params }: { params: { date: string } }) {
  const date = params.date;

  //前回の記録を表示
  const { data: prevRecord } = await supabase
    .from("records")
    .select("*")
    .lt("date", date)
    .order("date", { ascending: false })
    .limit(1);

    const prev = prevRecord?.[0] ?? null;

  //レコード取得
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
  const defaultValues: TodayFormData = record
    ? {
      date: record.date,
      weight: record.weight?.toString() ?? null,
      steps: record.steps?.toString() ?? null,
      memo: record.memo ??  "",
    }
    : {
      date,
      weight: null,
      steps: null,
      memo: "",
    };
  /*************** today/calendarでの差異表示に使用
  //前回のweightレコード
  const prevWeight = await supabase
  .from("records")
  .select("date, weight")
  .lt("date", date)
  .not("weight", "is", null)
  .order("date", { ascending: false })
  .limit(1);

  //前回のstepsレコード
  const prevSteps = await supabase
  .from("records")
  .select("date, steps")
  .lt("date", date)
  .not("steps", "is", null)
  .order("date", { ascending: false })
  .limit(1);
*/

if (!defaultValues) {
  return null; // or ローディング
}

  return (
    <TodayForm
      defaultValues={defaultValues}
      isEdit={isEdit}
      recordId={record?.id ?? null}
      prevRecord={prev}
    />
  );
}
