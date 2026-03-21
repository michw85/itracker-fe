import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import AcceptInvite from "./pages/AcceptInvite";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import {
  checkAuth,
  getMe,
  selectIsAuthLoading,
} from "./features/auth/slice/authSlice";
import Profile from "./pages/Profile";
import type { AppDispatch, RootState } from "./app/store";
import { useSelector } from "react-redux";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
const AUTH_STORAGE_KEY = "is_authenticated";
function App() {
  const dispatch = useAppDispatch<AppDispatch>();
  const isAuthLoading = useAppSelector(selectIsAuthLoading);
  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const user = useAppSelector((state) => state.auth.user);

  // Sync authentication state with localStorage
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Check authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      console.log("🔵 Initializing auth...");
      console.log("🔵 Token exists:", !!localStorage.getItem("accessToken"));

      const result = await dispatch(checkAuth());
      console.log("🟢 checkAuth result:", result);

      if (checkAuth.fulfilled.match(result)) {
        console.log("🟢 checkAuth fulfilled, loading user data...");
        const meResult = await dispatch(getMe());
        console.log("🟢 getMe result:", meResult);
      } else {
        console.log("🔴 checkAuth rejected");
      }
    };

    initAuth();
  }, [dispatch]);

  console.log("🟡 App render - isAuthLoading:", isAuthLoading);
  console.log("🟡 App render - isAuthenticated:", isAuthenticated);
  console.log("🟡 App render - user:", user);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <nav></nav>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
