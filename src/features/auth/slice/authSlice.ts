import { createAppSlice } from "../../../app/createAppSlice";
import type {
  AuthSliceState,
  Credentials,
  UserRegistrationDto,
  User,
} from "../types";
import * as api from "../services/api";
import { isAxiosError } from "axios";

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem("is_authenticated");
    console.log(raw);
    
    if (!raw || raw == "false") {
      console.log("false");
      return false;
    }
    console.log("true");
    return true;
  } catch {
    return false;
  }
}

const initialState: AuthSliceState = {
  isAuthenticated: loadFromLocalStorage(),
  user: undefined,
  isAuthLoading: true,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk(
      async (credentials: Credentials) => {
        return api.fetchLogin(credentials).catch((err) => {
          if (isAxiosError(err)) {
            throw new Error(
              err.response?.data?.message || "Internal Server Error",
            );
          }
        });
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
        },
        fulfilled: (state) => {
          state.isAuthenticated = true;
          state.loginErrorMessage = undefined;
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
      async (dto: UserRegistrationDto, { rejectWithValue }) => {
        try {
          return await api.fetchRegister(dto);
          // The value we return becomes the `fulfilled` action payload
        } catch (err) {
          if (isAxiosError(err)) {
            return rejectWithValue(
              err.response?.data || { message: "Internal server error" },
            );
          }

          return rejectWithValue({ message: "Internal server error" });
        }
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.loginErrorMessage = undefined;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.loginErrorMessage = undefined;
        },
        rejected: (state, action) => {
          state.isAuthenticated = false;
          state.user = undefined;

          if (
            action.payload &&
            typeof action.payload === "object" &&
            "message" in action.payload
          ) {
            state.loginErrorMessage = String(action.payload.message);
          } else {
            state.loginErrorMessage = action.error.message;
          }
        },
      },
    ),

    checkAuth: create.asyncThunk(
      async (_, { rejectWithValue } ) => {
        try {
          return api.fetchAuth();
        } catch (err) {
          if (isAxiosError(err)) {
            return rejectWithValue(
              err.response?.data?.message || "Internal Server Error",
            );
          }
        }
      },
      {
        pending: (state) => {
          state.isAuthLoading = true;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.isAuthLoading = false;
        },
        rejected: (state) => {
          state.isAuthenticated = false;
          state.user = undefined;
          state.isAuthLoading = false;
        },
      },
    ),

    updateProfile: create.asyncThunk(
      async (dto: Partial<User>) => {
        return api.fetchUpdateProfile(dto);
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
        },
      },
    ),

    logout: create.asyncThunk(
      async () => {
        return api.fetchLogout().catch((err) => {
          if (isAxiosError(err)) {
            throw new Error(
              err.response?.data?.message || "Internal Server Error",
            );
          }
        });
      },
      {
        fulfilled: (state) => {
          state.isAuthenticated = false;
          state.user = undefined;
          state.loginErrorMessage = undefined;
        },
        rejected: (state) => {
          state.isAuthenticated = false;
          state.user = undefined;
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAuthLoading: (state) => state.isAuthLoading,
    selectUser: (state) => state.user,
    selectRole: (state) => state.user?.role,
    selectLoginError: (state) => state?.loginErrorMessage,
  },
});

// // Action creators are generated for each case reducer function.
export const { login, register, logout, checkAuth, updateProfile } =
  authSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectUser,
  selectRole,
  selectLoginError,
} = authSlice.selectors;
