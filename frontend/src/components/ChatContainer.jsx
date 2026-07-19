import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { motion } from "framer-motion";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    markMessagesAsRead,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    markMessagesAsRead(selectedUser._id);
  }, [selectedUser._id, getMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
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
              className={`flex ${isSent ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] ${isSent ? "flex-row-reverse" : "flex-row"} items-end gap-3`}>
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

                {/* Message Bubble */}
                <div className="flex flex-col gap-1.5" style={{ minWidth: 0 }}>
                  <div
                    className={`rounded-[20px] ${
                      isSent
                        ? "rounded-tr-sm"
                        : "rounded-tl-sm"
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
                  <div 
                    className={`text-[11px] font-medium opacity-60 flex items-center gap-1 ${isSent ? "justify-end mr-2" : "justify-start ml-2"}`} 
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {formatMessageTime(message.createdAt)}
                    {isSent && (
                      <span style={{ color: "var(--accent-primary)", marginLeft: "4px" }}>
                        {message.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
