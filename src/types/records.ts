export type RecordFields = {
  id: number;
  date: Date;
  weight: number;
  steps: number;
  memo: string;
  profileId: number;
  profile?: string;
}

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