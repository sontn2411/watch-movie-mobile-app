export interface PayloadRegister {
  username: string;
  email: string;
  password: string;
}

interface User {
  username: string;
  email: string;
}

interface Error {
  status: number;
  code: string;
  message: string;
  details?: {
    field: string;
    message: string;
    summary: string;
  }[];
}

export interface ResponseRegister {
  message?: string;
  user?: User;
  error?: Error;
  success?: boolean;
}

export interface PayloadLogin {
  identity: string;
  password: string;
}

export interface ResponseLogin {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  error?: Error;
  success?: boolean;
}
