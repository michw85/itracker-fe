import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { checkAuth, getMe } from "./features/auth/slice/authSlice";
import Profile from "./pages/Profile";
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth()).then((result) => {
      if (checkAuth.fulfilled.match(result)) {
        dispatch(getMe());
      }
    });
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
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
