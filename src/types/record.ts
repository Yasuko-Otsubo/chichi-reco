// records/[date]/route.tsで使用中型
export type RecordData = {
  id: number
  date: string
  weight: number | null
  steps: number | null
  morningSystolic: number | null
  morningDiastolic: number | null
  eveningSystolic: number | null
  eveningDiastolic: number | null
  memo: string | null
}

export type RecordGraphData = {
  id: number
  date: string
  weight? : number | null
  steps? : number | null
}

export type RecordResponse = {
  status: "OK" | "NG";
  message: string;
  record?: RecordData | null;
};

export type UpdateRecordRequestBody = {
  date?: string;
  weight?: number | null;
  steps?: number | null;
  morningSystolic?: number | null;
  morningDiastolic?: number | null;
  eveningSystolic?: number | null;
  eveningDiastolic?: number | null;
  memo?: string | null;
};

// records/route.tsで使用中型
export type CreateRecordRequestBody = {
  date: string;
  weight: number | null;
  steps: number | null;
  morningSystolic: number | null;
  morningDiastolic: number | null;
  eveningSystolic: number | null;
  eveningDiastolic: number | null;
  memo: string | null;
};

export type RecordsResponse = {
  status: "OK" | "NG";
  message: string;
  records: RecordData[];
};
