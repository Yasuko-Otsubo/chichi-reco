import { Records } from "@prisma/client";
import { RecordFields } from "@/types/records";

export function toRecordFields(data: Records): RecordFields {
  return {
    id: data.id,
    date: data.date.toISOString(),
    weight: data.weight,
    steps: data.steps,
    memo: data.memo,
    profileId: String(data.profileId)
  };
}