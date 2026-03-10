import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./app/store";
import { useSelector } from "react-redux";

const AUTH_STORAGE_KEY = "is_authenticated";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const isAuth: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // Синхронизация статуса аутентификации, если она меняется
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuth));
  }, [dispatch, isAuth]);

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
