import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "./app/store";
import { useSelector } from "react-redux";
import {
  checkAuth,
  getMe,
  selectIsAuthLoading,
} from "./features/auth/slice/authSlice";
import Profile from "./pages/Profile";

const AUTH_STORAGE_KEY = "is_authenticated";

function App() {
  const dispatch = useAppDispatch<AppDispatch>();

  const isAuthLoading = useAppSelector(selectIsAuthLoading);

  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(checkAuth()).then((result) => {
      if (checkAuth.fulfilled.match(result)) {
        dispatch(getMe());
      }
    });
    !isAuthenticated && dispatch(checkAuth());
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
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
