import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Welcome content container */}
      <div className="max-w-md text-center relative z-10" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Icon Display */}
        <div className="flex justify-center" style={{ marginBottom: "16px" }}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-[20px] flex items-center justify-center text-white"
            style={{
              width: "80px",
              height: "80px",
              background: "var(--sent-bubble)",
              boxShadow: "var(--shadow-glow-strong), inset 0 2px 0 rgba(255,255,255,0.2)",
            }}
          >
            <MessageSquare className="w-10 h-10" />
          </motion.div>
        </div>

        {/* Welcome Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 className="text-[32px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Welcome to Chatty!</h2>
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
            Select a conversation from the sidebar to start chatting with your friends
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
