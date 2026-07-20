import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { motion } from "framer-motion";

import { useEffect } from "react";

const HomePage = () => {
  const { selectedUser, subscribeToTyping, unsubscribeFromTyping, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { subscribeToFriendEvents, unsubscribeFromFriendEvents, getFriends, getPendingRequests } = useFriendStore();
  const { socket } = useAuthStore();

  useEffect(() => {
    if (socket) {
      subscribeToTyping();
      subscribeToMessages();
      subscribeToFriendEvents();
      getFriends();
      getPendingRequests();
    }
    
    return () => {
      unsubscribeFromTyping();
      unsubscribeFromMessages();
      unsubscribeFromFriendEvents();
    };
  }, [socket, subscribeToTyping, unsubscribeFromTyping, subscribeToMessages, unsubscribeFromMessages, subscribeToFriendEvents, unsubscribeFromFriendEvents, getFriends, getPendingRequests]);

  return (
    <div className="h-screen w-full relative overflow-hidden" style={{ background: "transparent" }}>


      <div className="flex items-center justify-center relative z-10" style={{ height: "100%", paddingTop: "100px", paddingBottom: "32px", paddingLeft: "16px", paddingRight: "16px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-7xl flex gap-4 h-full"
        >
          {/* Left Box: Sidebar */}
          <div 
            className="h-full rounded-[24px] overflow-hidden flex-shrink-0 flex"
            style={{ 
              background: "var(--bg-secondary)", 
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            <Sidebar />
          </div>

          {/* Right Box: Chat Area */}
          <div 
            className="h-full flex-1 rounded-[24px] overflow-hidden flex"
            style={{ 
              background: "var(--bg-secondary)", 
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
