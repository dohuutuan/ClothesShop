import type { LoginData, LoginResponse, RegisterData, ResetPasswordInput } from "../types/types";
import api from "./api";
export const loginApi = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data, {
    withCredentials: true,
  });
  return response.data.data;
};

export const registerApi = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data.data;
};

export const activateAccountApi = async (token: string | null) => {
  const encodedToken = encodeURIComponent(token ?? "");
  const response = await api.patch(`/auth/activate?token=${encodedToken}`);
  return response.data.data;
};

export const resendActivationEmailApi = async (token: string) => {
  const response = await api.post("/auth/re-activate", token, {
    headers: {
      "Content-Type": "application/json", // vẫn là JSON
    },
  });
  return response.data.data;
};

export const resendEmailApi = async (account: string) => {
  const response = await api.post("/auth/activate", account, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export const refreshTokenApi = async () => {
  const response = await api.post("/auth/refresh", null, {
    withCredentials: true,
  });
  return response.data.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout", null, {
    withCredentials: true,
  });
  return response.data.data;
};

export const forgotPasswordApi = async (data: {account: string}) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data.data;
};

export const resetPasswordApi = async (data: ResetPasswordInput) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data.data;
};