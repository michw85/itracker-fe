import { createAppSlice } from "../../../app/createAppSlice";
import type {
  AuthSliceState,
  Credentials,
  LoginResponse,
  UserRegistrationDto,
} from "../types";
import * as api from "../services/api";


const initialState: AuthSliceState = {
  isAuthenticated: false,
  user: undefined,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk<LoginResponse, Credentials>(
      async (credentials: Credentials) => {
        const response = await api.fetchLogin(credentials);
        return response;
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.loginErrorMessage = undefined;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
        },
        rejected: (state, action) => {
          state.isAuthenticated = false;
          state.user = undefined;
          console.log(action.error);
          state.loginErrorMessage = action.error.message;
        },
      },
    ),

    register: create.asyncThunk(
      async (dto: UserRegistrationDto) => {
        return api.fetchRegister(dto);
        // The value we return becomes the `fulfilled` action payload
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
        },
        rejected: (state, action) => {
          state.isAuthenticated = false;
          state.loginErrorMessage = action.error.message;
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    selectRole: (state) => state.user?.role,
    selectLoginError: (state) => state?.loginErrorMessage,
  },
});

// // Action creators are generated for each case reducer function.
export const { login, register } = authSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectIsAuthenticated,
  selectUser,
  selectRole,
  selectLoginError,
} = authSlice.selectors;

