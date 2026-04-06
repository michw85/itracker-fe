import { NavLink, Link, useNavigate } from "react-router-dom";
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

  const getNavLinkStyles = ({ isActive }: { isActive: boolean }) => {
    const base =
      "text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-md border ";

    if (isActive) {
     return (
        base + "text-black border-transparent border-b-black bg-gray-50/50 hover:border-black" 
      );
    }
    return (
      base +
      "text-gray-600 border-transparent hover:text-black hover:border-black"
    );
  };

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
            <img
              src="/public/images/Logo.png"
              alt="ITracker logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
            <span className="text-emerald-500">IT</span>racker
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-2">
          <NavLink to="/" className={getNavLinkStyles}>
            Home
          </NavLink>
          <NavLink to="/about" className={getNavLinkStyles}>
            About
          </NavLink>
          <NavLink to="/projects" className={getNavLinkStyles}>
            Projects
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={getNavLinkStyles}>
                Profile
              </NavLink>
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
