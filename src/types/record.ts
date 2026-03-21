// records/[date]/route.tsで使用中型
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

// records/route.tsで使用中型
export type CreateRecordRequestBody = {
  date: string;
  weight: number | null;
  steps: number | null;
  memo: string | null;
};

export type RecordsResponse = {
  status: "OK" | "NG";
  message: string;
  records: RecordData[];
};
