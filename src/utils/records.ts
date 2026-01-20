import { Record } from "@prisma/client";
import { RecordFields } from "@/types/records";

export function toRecordFields(data: Record): RecordFields {
  return {
    id: data.id,
    date: data.date.toISOString(),
    weight: data.weight,
    steps: data.steps,
    memo: data.memo,
    profileId: data.profileId
  };
}