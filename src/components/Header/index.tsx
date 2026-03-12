import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-semibold text-gray-900">
          MyApp
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link
            to="/projects"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Projects
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-500 hover:text-black transition"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="rounded bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
