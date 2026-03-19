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
        return api.fetchAuth();
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
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
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
updateAvatarUrl: create.asyncThunk(
  async (avatarUrl: string) => {
    return api.fetchUpdateAvatarUrl(avatarUrl);
  },
  {
    fulfilled: (state, action) => {
      state.user = action.payload;
    },
  }
),

uploadAvatarFile: create.asyncThunk(
  async (file: File) => {
    return api.fetchUploadAvatarFile(file);
  },
  {
    fulfilled: (state, action) => {
      state.user = action.payload;
    },
  }
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

// // Action creators are generated for each case reducer function.
export const { login, register, logout, checkAuth, getMe, updateProfile, updateAvatarUrl, uploadAvatarFile } =
  authSlice.actions;

export const {
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectUser,
  selectRole,
  selectLoginError,
} = authSlice.selectors;
