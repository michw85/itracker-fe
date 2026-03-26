import axiosInstance from "../../../lib/axiosInstance";
import type { Credentials, User } from "../types";

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const AUTH_ME_PATH = "/users/profile/me";
const LOGOUT_PATH = "/auth/logout";
export const ME_PATH = "/auth/me";
const FORGOT_PASSWORD_PATH = "/auth/forgot-password";
const RESET_PASSWORD_PATH = "/auth/reset-password";

export const fetchMe = async () => {
  const res = await axiosInstance.get(AUTH_ME_PATH);
  return res.data;
};

export const fetchUpdateProfile = async (dto: Partial<User>) => {
  const res = await axiosInstance.put(AUTH_ME_PATH, dto);
  return res.data;
};

export const fetchLogin = async (credentials: Credentials) => {
  const res = await axiosInstance.post(LOGIN_PATH, credentials);
  console.log("🔵 Login API response:", res.data);
  return res.data;
};

export const fetchRegister = async (credentials: Credentials) => {
  const res = await axiosInstance.post(REGISTER_PATH, credentials);
  return res.data;
};

export const fetchAuth = async () => {
  const res = await axiosInstance.get(AUTH_ME_PATH);
  return res.data;
};

export const fetchLogout = async () => {
  const res = await axiosInstance.post(LOGOUT_PATH);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post(FORGOT_PASSWORD_PATH, { email });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axiosInstance.post(RESET_PASSWORD_PATH, {
    token,
    newPassword,
  });
  return res.data;
};
// Swagger: POST /api/v1/users/profile/me/avatar/url
export const fetchUpdateAvatarUrl = async (avatarUrl: string) => {
  const res = await axiosInstance.post(`${AUTH_ME_PATH}/avatar/url`, {
    avatarUrl,
  });
  return res.data;
};

// Swagger: POST /api/v1/users/profile/me/avatar
export const fetchUploadAvatarFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post(`${AUTH_ME_PATH}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
