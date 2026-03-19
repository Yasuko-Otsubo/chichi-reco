export type RecordData = {
  id: number
  date: string
  weight: number | null
  steps: number | null
  memo: string | null
}

export type RecordResponse = {
  status: "OK" | "NG";
  message: string;
  record?: RecordData;
};

export type UpdateRecordRequestBody = {
  date?: string;
  weight?: number | null;
  steps?: number | null;
  memo?: string | null;
};
