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
import UIKit from "./pages/UIKit";
import type { AppDispatch, RootState } from "./app/store";
import { useSelector } from "react-redux";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProjectDetails from "./pages/ProjectDetails";
const AUTH_STORAGE_KEY = "is_authenticated";
function App() {
  const dispatch = useAppDispatch<AppDispatch>();
  const isAuthLoading = useAppSelector(selectIsAuthLoading);
  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // Sync authentication state with localStorage
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Check authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      const result = await dispatch(checkAuth());

      if (checkAuth.fulfilled.match(result)) {
        await dispatch(getMe());
      }
    };

    initAuth();
  }, [dispatch]);

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
          <Route path="/ui-kit" element={<UIKit />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route
            path="/projects/:id/edit"
            element={<div>Edit Project (coming soon)</div>}
          />
          <Route
            path="/projects/:id/members"
            element={<div>Manage Members (coming soon)</div>}
          />
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
