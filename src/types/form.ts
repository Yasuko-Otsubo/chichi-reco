export type TodayFormValues = {
  date: string;
  weight?: string;
  steps?: string;
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
