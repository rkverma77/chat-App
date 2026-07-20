import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Trash2, SmilePlus } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    markMessagesAsRead,
    typingUsers,
    deleteMessage,
    reactToMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);

  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    getMessages(selectedUser._id);
    markMessagesAsRead(selectedUser._id);
  }, [selectedUser._id, getMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      // Only smooth scroll if a single new message arrived. Otherwise (initial load), jump instantly.
      const isNewMessage = messages.length === prevMessageCountRef.current + 1;
      messageEndRef.current.scrollIntoView({ behavior: isNewMessage ? "smooth" : "auto" });
      prevMessageCountRef.current = messages.length;
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto w-full" style={{ background: "transparent" }}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full" style={{ background: "transparent" }}>
      <ChatHeader />

      <div className="flex-1 overflow-y-auto" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map((message) => {
          const isSent = message.senderId === authUser._id;
          return (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isSent ? "justify-end" : "justify-start"} group relative reaction-container ${
                activeReactionMessageId === message._id ? "z-50" : "z-0"
              }`}
              onMouseLeave={() => {
                if (activeReactionMessageId === message._id) {
                  setActiveReactionMessageId(null);
                }
              }}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] ${isSent ? "flex-row-reverse" : "flex-row"} items-end gap-3 relative`}>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      isSent
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ border: "1px solid var(--border-color)" }}
                  />
                </div>

                {/* Message & Actions Row */}
                <div className="flex flex-col gap-1.5" style={{ minWidth: 0 }}>
                  
                  <div className={`flex items-center gap-2 group ${isSent ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Message Bubble */}
                    <div
                      className={`relative rounded-[20px] ${
                        isSent ? "rounded-tr-sm" : "rounded-tl-sm"
                      }`}
                      style={{
                        padding: "12px 20px",
                        background: isSent ? "var(--sent-bubble)" : "var(--received-bubble)",
                        color: isSent ? "var(--sent-bubble-text)" : "var(--received-bubble-text)",
                        boxShadow: isSent ? "var(--shadow-sm)" : "none",
                      }}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-[200px] sm:max-w-[250px] rounded-[14px] mb-3 object-cover"
                          style={{ border: "1px solid var(--border-color)" }}
                        />
                      )}
                      {message.text && (
                        <p className="text-[14px] leading-relaxed break-words" style={{ margin: 0 }}>
                          {message.text}
                        </p>
                      )}
                    </div>

                    {/* Actions Container */}
                    <div className={`flex items-center gap-1.5 transition-all duration-200 ${
                      activeReactionMessageId === message._id 
                        ? "opacity-100 translate-x-0" 
                        : `opacity-0 group-hover:opacity-100 ${isSent ? "-translate-x-2 group-hover:translate-x-0" : "translate-x-2 group-hover:translate-x-0"}`
                    }`}>
                      {isSent && (
                        <button
                          onClick={() => deleteMessage(message._id)}
                          className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--bg-glass-hover)] rounded-full transition-all cursor-pointer shadow-sm bg-[var(--bg-primary)] border border-[var(--border-color)]"
                          title="Delete message"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      <div className="relative z-50">
                        <button
                          onClick={() => {
                            setActiveReactionMessageId(activeReactionMessageId === message._id ? null : message._id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-glass-hover)] rounded-full transition-all cursor-pointer shadow-sm bg-[var(--bg-primary)] border border-[var(--border-color)]"
                          title="React to message"
                        >
                          <SmilePlus size={15} />
                        </button>
                        <AnimatePresence>
                          {activeReactionMessageId === message._id && (
                            <div className={`absolute top-full ${isSent ? "right-0" : "left-0"} pt-3 z-[60] w-max`}>
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full shadow-lg flex items-center p-1.5 gap-1.5 w-max`}
                              >
                                {["👍", "❤️", "😂", "😮", "😢", "🙏"].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      reactToMessage(message._id, emoji);
                                      setActiveReactionMessageId(null);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--bg-glass-hover)] hover:scale-110 active:scale-95 rounded-full transition-all cursor-pointer"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {message.reactions && message.reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 relative z-10 -mt-3.5 ${isSent ? "justify-end pr-2" : "justify-start pl-2"}`}>
                      {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
                        const count = message.reactions.filter(r => r.emoji === emoji).length;
                        const hasReacted = message.reactions.some(r => r.emoji === emoji && r.userId === authUser._id);
                        return (
                          <button
                            key={emoji}
                            onClick={() => reactToMessage(message._id, emoji)}
                            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border shadow-sm transition-all cursor-pointer ${
                              hasReacted 
                                ? "bg-[var(--accent-glow)] border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white" 
                                : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-glass-hover)]"
                            }`}
                          >
                            <span>{emoji}</span>
                            {count > 1 && <span>{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div 
                    className={`text-[11px] font-medium opacity-60 flex items-center gap-1 ${isSent ? "justify-end mr-2" : "justify-start ml-2"}`} 
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {formatMessageTime(message.createdAt)}
                    {isSent && (
                      <span style={{ color: "var(--accent-primary)", marginLeft: "4px" }}>
                        {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {typingUsers.includes(selectedUser._id) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[85%] sm:max-w-[75%] flex-row items-end gap-3">
              <div className="flex-shrink-0">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: "1px solid var(--border-color)" }}
                />
              </div>
              <div
                className="rounded-[20px] rounded-tl-sm flex items-center justify-center gap-1.5"
                style={{
                  padding: "16px 20px",
                  background: "var(--received-bubble)",
                  boxShadow: "none",
                  height: "44px"
                }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--text-muted)" }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--text-muted)" }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--text-muted)" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
