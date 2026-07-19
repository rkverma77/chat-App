import { Moon, Send, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden" style={{ background: "transparent", paddingTop: "120px", paddingBottom: "48px" }}>


      <div className="max-w-3xl w-full mx-auto relative z-10" style={{ paddingLeft: "16px", paddingRight: "16px", marginTop: "32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="text-center sm:text-left" style={{ marginBottom: "40px" }}>
            <h1 className="text-[32px] sm:text-[36px] font-bold tracking-tight leading-tight" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>Settings</h1>
            <p className="text-[16px]" style={{ color: "var(--text-secondary)" }}>Manage your application preferences</p>
          </div>

          {/* Glass Card Container */}
          <div 
            className="rounded-[24px] overflow-hidden"
            style={{ 
              background: "var(--bg-secondary)", 
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            {/* Appearance Section */}
            <div style={{ padding: "32px", borderBottom: "1px solid var(--border-color)" }}>
              <div className="flex justify-between items-center" style={{ marginBottom: "24px" }}>
                <div>
                  <h2 className="text-[18px] font-semibold" style={{ color: "var(--text-primary)" }}>Appearance</h2>
                  <p className="text-[14px]" style={{ marginTop: "4px", color: "var(--text-secondary)" }}>
                    Choose your preferred theme
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  className="relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none"
                  style={{
                    background: isDark ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    boxShadow: isDark ? "0 0 15px var(--accent-glow)" : "none",
                    border: "1px solid var(--border-color)"
                  }}
                  onClick={() => setTheme(isDark ? "light" : "dark")}
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
              </div>
            </div>

            {/* Preview Section */}
            <div style={{ padding: "32px" }}>
              <h2 className="text-[18px] font-semibold" style={{ marginBottom: "24px", color: "var(--text-primary)" }}>
                Preview
              </h2>

              {/* Mock Chat UI */}
              <div
                className="rounded-[16px] overflow-hidden flex flex-col"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  height: "380px",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.1)"
                }}
              >
                {/* Chat Header */}
                <div
                  className="flex items-center"
                  style={{
                    padding: "16px",
                    gap: "16px",
                    background: "var(--bg-tertiary)",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    className="w-10 h-10 flex-shrink-0 rounded-full text-white flex items-center justify-center font-bold text-sm relative"
                    style={{ background: "var(--accent-primary)", boxShadow: "0 0 15px var(--accent-glow-strong)" }}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--accent-primary)" }} />
                    <span className="relative z-10">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>John Doe</div>
                    <div className="text-[12px] font-medium flex items-center gap-1.5" style={{ display: "flex", gap: "6px", color: "var(--accent-primary)" }}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ display: "inline-block", backgroundColor: "var(--accent-primary)" }}></span>
                      Online
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Received Bubble */}
                  <div className="flex justify-start">
                    <div style={{ maxWidth: "80%" }}>
                      <div
                        className="rounded-[20px] rounded-tl-sm shadow-sm"
                        style={{
                          padding: "12px 20px",
                          background: "var(--received-bubble)",
                          color: "var(--received-bubble-text)",
                        }}
                      >
                        <p className="text-[14px] leading-relaxed break-words" style={{ margin: 0 }}>Hey! Have you seen the new redesign? It looks absolutely stunning. 🔥</p>
                      </div>
                      <p className="text-[11px] opacity-60" style={{ marginTop: "6px", marginLeft: "8px", color: "var(--text-muted)" }}>12:00 PM</p>
                    </div>
                  </div>

                  {/* Sent Bubble */}
                  <div className="flex justify-end">
                    <div style={{ maxWidth: "80%" }}>
                      <div
                        className="rounded-[20px] rounded-tr-sm text-white shadow-[0_4px_15px_var(--accent-glow)]"
                        style={{
                          padding: "12px 20px",
                          background: "var(--sent-bubble)",
                        }}
                      >
                        <p className="text-[14px] leading-relaxed break-words" style={{ margin: 0 }}>Yes! The glassmorphism and grid background are super clean.</p>
                      </div>
                      <p className="text-[11px] opacity-80 text-right" style={{ marginTop: "6px", marginRight: "8px", color: "var(--text-muted)" }}>12:01 PM</p>
                    </div>
                  </div>
                </div>

                {/* Chat Input Placeholder */}
                <div
                  className="flex items-center"
                  style={{
                    padding: "16px",
                    gap: "12px",
                    background: "var(--bg-tertiary)",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <div 
                    className="flex-1 rounded-full text-[14px]"
                    style={{
                      padding: "12px 20px",
                      background: "var(--bg-glass)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    Type your message...
                  </div>
                  <div
                    className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
                    style={{ background: "var(--sent-bubble)", boxShadow: "0 4px 12px var(--shadow-glow)" }}
                  >
                    <Send className="w-5 h-5" style={{ marginLeft: "2px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
