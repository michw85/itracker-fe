import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { checkAuth } from "./features/auth/slice/authSlice";
import type { AppDispatch, RootState } from "./app/store";
import { useSelector } from "react-redux";

const AUTH_STORAGE_KEY = "is_authenticated";

function App() {
  const dispatch = useAppDispatch<AppDispatch>();

  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    !isAuthenticated && dispatch(checkAuth());
  }, [dispatch]);

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
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
