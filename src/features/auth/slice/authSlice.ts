import { createAppSlice } from "../../../app/createAppSlice";
import type {
  AuthSliceState,
  Credentials,
  UserRegistrationDto,
  User,
  AuthResponse,
} from "../types";
import * as api from "../services/api";
import { isAxiosError } from "axios";

// Function for checking the presence of a token
function checkToken() {
  const token = localStorage.getItem("accessToken");
  return !!token; // returns true if the token exists
}

const initialState: AuthSliceState = {
  isAuthenticated: checkToken(), // Checking for the presence of a token
  user: undefined,
  isAuthLoading: true,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    // Login with JWT
    login: create.asyncThunk(
      async (credentials: Credentials) => {
        const response = (await api.fetchLogin(credentials)) as AuthResponse;

        // Save tokens on successful login
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        // Save the authentication flag
        localStorage.setItem("is_authenticated", "true");

        return response;
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.loginErrorMessage = undefined;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.loginErrorMessage = undefined;
        },
        rejected: (state, action) => {
          state.isAuthenticated = false;
          state.user = undefined;
          state.loginErrorMessage = action.error.message || "Login failed";

          // Remove tokens on error
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("is_authenticated");
        },
      },
    ),

    // Register
    register: create.asyncThunk(
      async (dto: UserRegistrationDto, { rejectWithValue }) => {
        try {
          return await api.fetchRegister(dto);
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

    // Check authentication status
    checkAuth: create.asyncThunk(
  async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }
    // We just check that the token is valid.
    await api.fetchAuth();
    return { success: true };
  },
  {
    pending: (state) => {
      state.isAuthLoading = true;
    },
    fulfilled: (state) => {
      state.isAuthenticated = true;
      state.isAuthLoading = false;
      localStorage.setItem("is_authenticated", "true");
    },
    rejected: (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
      state.isAuthLoading = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("is_authenticated");
    },
  },
),

    // Get current user data
    getMe: create.asyncThunk(
      async () => {
        console.log("🔵 Fetching user data...");
        const data = await api.fetchMe();
        console.log("🟢 User data:", data);
        return data;
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
          console.log("✅ User loaded:", action.payload);
        },
        rejected: (state, action) => {
          state.user = undefined;
          console.error("❌ Failed to load user:", action.error);
        },
      },
    ),

    // Update user profile
    updateProfile: create.asyncThunk(
      async (dto: Partial<User>) => {
        return api.fetchUpdateProfile(dto);
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
        },
        rejected: (_, action) => {
          console.error("❌ Failed to update profile:", action.error);
        },
      },
    ),

    // Logout
    logout: create.asyncThunk(
      async () => {
        try {
          await api.fetchLogout();
        } finally {
          // Always remove tokens on logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("is_authenticated");
        }
      },
      {
        fulfilled: (state) => {
          state.isAuthenticated = false;
          state.user = undefined;
          state.loginErrorMessage = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAuthLoading: (state) => state.isAuthLoading,
    selectUser: (state) => state.user,
    selectRole: (state) => state.user?.role,
    selectLoginError: (state) => state?.loginErrorMessage,
  },
});

export const { login, register, logout, checkAuth, getMe, updateProfile } =
  authSlice.actions;

export const {
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectUser,
  selectRole,
  selectLoginError,
} = authSlice.selectors;