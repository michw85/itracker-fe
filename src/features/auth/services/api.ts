import axiosInstance from "../../../lib/axiosInstance";
import type { Credentials } from "../types";

// we already added  prefix /api in axios config

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const AUTH_PATH = "/users/profile/me";
const LOGOUT_PATH = "/auth/logout";


export const fetchLogin = async (credentials: Credentials) => {
  const res = await axiosInstance.post(LOGIN_PATH, credentials);
  return res.data;
};


export const fetchRegister = async (credentials: Credentials) => {
  const res = await axiosInstance.post(REGISTER_PATH, credentials);
  return res.data;
};

export const fetchAuth = async () => {
  const res = await axiosInstance.get(AUTH_PATH);
  return res.data;
};

export const fetchLogout = async () => {
  const res = await axiosInstance.post(LOGOUT_PATH);
  return res.data;
};
