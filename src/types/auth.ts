export type UpdatePasswordRequest = {
  password: string
}

export type UpdateAuthResponse = {
  status: "OK" | "NG"
  message: string;
}

export type UpdateEmailRequest = {
  email: string
}