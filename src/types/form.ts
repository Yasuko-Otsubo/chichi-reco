export type TodayFormValues = {
  date: string;
  weight?: string;
  steps?: string;
  morningSystolic?: string;
  morningDiastolic?: string;
  eveningSystolic?: string;
  eveningDiastolic?: string;
  memo?: string;
};

export type MyPageFormValues = {
  name?: string;
  supabaseUserId: string;
  height?: string;
  targetWeight?: string;
  email?: string;
  password?: string;
};

export type ContactFormValues = {
  name: string;
  email: string;
  content: string;
};
