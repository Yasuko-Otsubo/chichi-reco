export type ContactCreateRequest = { 
  name: string;
  email: string;
  content: string;
}

export type ContactCreateResponse = {
  status: "OK" | "NG";
  message: string;
  id?: number;
}