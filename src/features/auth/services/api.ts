import axiosInstance from "../../../lib/axiosInstance";
import type { Credentials, User } from "../types";

// we already added  prefix /api in axios config

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const AUTH_PATH = "/users/profile/me";
const LOGOUT_PATH = "/auth/logout";
export const ME_PATH = "/auth/me";
const FORGOT_PASSWORD_PATH = "auth/forgot-password";
const RESET_PASSWORD_PATH = "auth/reset-password";

export const fetchMe = async () => {
  const res = await axiosInstance.get(ME_PATH, { withCredentials: true });
  return res.data;
};
 
export const fetchUpdateProfile = async (dto: Partial<User>) => {
  const res = await axiosInstance.patch(ME_PATH, dto, { withCredentials: true });
  return res.data;
};
export const fetchLogin = async (credentials: Credentials) => {
  const res = await axiosInstance.post(LOGIN_PATH, credentials);
  return res.data;
};

export const fetchRegister = async (credentials: Credentials) => {
  const res = await axiosInstance.post(REGISTER_PATH, credentials);
  return res.data;
};

export const fetchAuth = async () => {
  const res = await axiosInstance.get(AUTH_PATH, {
    withCredentials: true,
  });
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
