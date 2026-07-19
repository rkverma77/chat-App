import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "transparent" }}>


      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] p-4 sm:p-0 z-10 relative"
        style={{ marginTop: "32px" }}
      >
        {/* Top Icon Floating Above */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: "-28px" }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="rounded-full flex items-center justify-center relative"
            style={{ width: "56px", height: "56px", background: "var(--accent-primary)", boxShadow: "0 0 20px var(--accent-glow-strong)" }}
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--accent-primary)" }} />
            <MessageSquare className="w-6 h-6 text-white relative z-10" />
          </motion.div>
        </div>

        {/* Card */}
        <div 
          className="rounded-[24px] relative overflow-hidden"
          style={{ 
            padding: "48px",
            background: "var(--bg-secondary)", 
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-lg)"
          }}
        >
          {/* Header */}
          <div className="text-center mb-10 mt-2">
            <h1 className="text-[36px] sm:text-[40px] font-bold tracking-tight mb-2 leading-tight" style={{ color: "var(--text-primary)" }}>Create Account</h1>
            <p className="text-[16px]" style={{ color: "var(--text-secondary)" }}>Get started with your free account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginTop: "24px" }}>
              <label className="block text-[11px] font-medium uppercase tracking-wider" style={{ marginBottom: "8px", color: "var(--text-secondary)" }}>
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "16px" }}>
                  <User className="h-5 w-5 transition-colors duration-250" style={{ color: "var(--text-muted)" }} />
                </div>
                <input
                  type="text"
                  className="rounded-[14px] focus:outline-none transition-all duration-250"
                  style={{ 
                    display: "block",
                    boxSizing: "border-box",
                    width: "100%",
                    height: "56px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    background: "var(--bg-tertiary)", 
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-primary)";
                    e.target.style.boxShadow = "0 0 0 1px var(--accent-primary), var(--shadow-glow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <label className="block text-[11px] font-medium uppercase tracking-wider" style={{ marginBottom: "8px", color: "var(--text-secondary)" }}>
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "16px" }}>
                  <Mail className="h-5 w-5 transition-colors duration-250" style={{ color: "var(--text-muted)" }} />
                </div>
                <input
                  type="email"
                  className="rounded-[14px] focus:outline-none transition-all duration-250"
                  style={{ 
                    display: "block",
                    boxSizing: "border-box",
                    width: "100%",
                    height: "56px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    background: "var(--bg-tertiary)", 
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-primary)";
                    e.target.style.boxShadow = "0 0 0 1px var(--accent-primary), var(--shadow-glow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <label className="block text-[11px] font-medium uppercase tracking-wider" style={{ marginBottom: "8px", color: "var(--text-secondary)" }}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "16px" }}>
                  <Lock className="h-5 w-5 transition-colors duration-250" style={{ color: "var(--text-muted)" }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="rounded-[14px] focus:outline-none transition-all duration-250"
                  style={{ 
                    display: "block",
                    boxSizing: "border-box",
                    width: "100%",
                    height: "56px",
                    paddingLeft: "44px",
                    paddingRight: "48px",
                    background: "var(--bg-tertiary)", 
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-primary)";
                    e.target.style.boxShadow = "0 0 0 1px var(--accent-primary), var(--shadow-glow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center transition-colors"
                  style={{ paddingRight: "16px", color: "var(--text-muted)" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="rounded-[16px] flex justify-center items-center text-white font-semibold text-[15px] transition-all duration-250"
              style={{ 
                display: "flex",
                boxSizing: "border-box",
                width: "100%",
                height: "56px",
                marginTop: "32px",
                background: "var(--sent-bubble)",
                boxShadow: "var(--shadow-glow), inset 0 1px 0 rgba(255,255,255,0.2)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-glow-strong), inset 0 1px 0 rgba(255,255,255,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-glow), inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <div className="text-center mt-8">
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-medium transition-colors duration-250 relative group ml-1"
                style={{ color: "var(--accent-primary)" }}
              >
                Sign in
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full" style={{ backgroundColor: "var(--accent-primary)" }}></span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
