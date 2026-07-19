import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { LogOut, MessageSquare, Settings, User, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const isDark = theme === "dark";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 transition-all duration-300"
    >
      <div 
        className="rounded-2xl h-14 flex items-center justify-between"
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          background: "var(--bg-glass)",
          border: "1px solid var(--border-color)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "var(--shadow-md)"
        }}
      >
        {/* Left Side: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg hidden sm:block" style={{ color: "var(--text-primary)" }}>
            Chatty
          </span>
        </Link>

        {/* Right Side: Navigation */}
        <div className="flex items-center gap-2">
          {/* Cool Theme Toggle */}
          <button
            type="button"
            className="relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none mr-1"
            style={{
              background: isDark ? "var(--accent-primary)" : "var(--bg-tertiary)",
              boxShadow: isDark ? "0 0 15px var(--accent-glow)" : "none",
              border: "1px solid var(--border-color)"
            }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title="Toggle theme"
          >
            <span className="sr-only">Toggle theme</span>
            <motion.span
              layout
              className="pointer-events-none flex items-center justify-center h-7 w-7 transform rounded-full shadow transition duration-300 ease-in-out"
              style={{
                translateX: isDark ? "32px" : "0px",
                background: "white"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? (
                    <Moon className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                  ) : (
                    <Sun className="w-4 h-4 text-gray-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.span>
          </button>

          {!isAuthPage && (
            <Link
              to="/settings"
              className="btn-ghost flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          )}

          {authUser && (
            <>
              <Link
                to="/profile"
                className="btn-ghost flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{
                  color: "var(--text-primary)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--destructive)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
