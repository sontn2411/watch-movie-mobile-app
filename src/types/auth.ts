export interface PayloadRegister {
  username: string;
  email: string;
  password: string;
}

interface User {
  username: string;
  email: string;
}

export interface ApiError {
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
  error?: ApiError; // For 422
  success?: boolean;
  // For 403 (top-level)
  status?: number;
  code?: string;
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
  error?: ApiError; // For 422
  success?: boolean;
  // For 403 (top-level)
  status?: number;
  code?: string;
}

