import { Record as PrismaRecord } from "@prisma/client";
//レスポンス用
export type RecordFields = {
  id: number;
  date: string;
  weight?: number;
  steps?: number;
  memo?: string;
  profileId: number;
}

//POST用
export type RecordCreateRequest = {
  date: string;
  weight?: number;
  steps?: number;
  memo?: string;
};

//DB ⇒ APIの変換
export const toRecordFields = (record: PrismaRecord): RecordFields => ({
  id: record.id,
  date: record.date.toISOString(),
  weight: record.weight ?? undefined,
  steps: record.steps ?? undefined,
  memo: record.memo ?? undefined,
  profileId: record.profileId,
});

export type RecordResponse = {
  status: "OK" | "NG";
  message: string;
  records?: RecordFields[];
}

//更新用
export type RecordUpdateRequest = {
  date?: string;
  weight?: number;
  steps?: number;
  memo?: string;
}

//API ⇒ UI の変換後のデータ型
export type RecordData = {
  id: number;
  date: string;
  weight: number | null;
  steps: number | null;
  memo: string | null;
  profileId: number;
  createdAt: string;
  updatedAt: string | null;
}