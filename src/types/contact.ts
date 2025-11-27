export type ContactFields = { 
  name: string;
  email: string;
  content: string;
}

export type ContactResponse = {
  status: string;
  message: string;
  id?: number;
}