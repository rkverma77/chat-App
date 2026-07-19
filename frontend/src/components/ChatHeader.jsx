import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion } from "framer-motion";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, typingUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);
  const isTyping = typingUsers.includes(selectedUser._id);

  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "16px 24px",
        background: "var(--bg-tertiary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: "2px solid var(--border-color)" }}
          />
          {isOnline && (
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full shadow-[0_0_10px_var(--accent-glow-strong)]"
              style={{ background: "var(--accent-primary)", border: "2px solid var(--bg-primary)" }}
            />
          )}
        </div>

        {/* User info */}
        <div>
          <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>
            {selectedUser.fullName}
          </h3>
          <p className="text-[12px] font-medium flex items-center gap-1.5 mt-0.5" style={{ color: isOnline ? "var(--accent-primary)" : "var(--text-muted)" }}>
            {isOnline && !isTyping && <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent-primary)" }}></span>}
            {isTyping ? "Typing..." : (isOnline ? "Online" : "Offline")}
          </p>
        </div>
      </div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "var(--bg-glass-hover)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSelectedUser(null)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
        style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)" }}
      >
        <X className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default ChatHeader;
