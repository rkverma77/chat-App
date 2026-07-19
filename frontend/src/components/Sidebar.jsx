import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { getUsers, users, searchResults, isSearching, searchUsers, clearSearch, selectedUser, setSelectedUser, isUsersLoading, typingUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        clearSearch();
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchUsers, clearSearch]);

  const displayedUsers = searchQuery ? searchResults : users;
  const filteredUsers = showOnlineOnly
    ? displayedUsers.filter((user) => onlineUsers.includes(user._id))
    : displayedUsers;

  if (isUsersLoading && !searchQuery) return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-80 flex flex-col transition-all duration-200"
      style={{
        background: "transparent"
      }}
    >
      <div
        className="w-full"
        style={{ padding: "24px", borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
          >
            <Users className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
          </div>
          <span className="font-semibold text-[16px] hidden lg:block" style={{ color: "var(--text-primary)" }}>
            Contacts
          </span>
        </div>
        
        {/* Search Bar */}
        <div className="mt-5 relative hidden lg:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-[13px] outline-none transition-all duration-200"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>
        
        {/* Toggle - Online only */}
        <div className="mt-5 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="opacity-0 absolute h-5 w-5 cursor-pointer z-10"
              />
              <div
                className="w-5 h-5 rounded-[6px] flex justify-center items-center transition-colors"
                style={{
                  background: showOnlineOnly ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  border: showOnlineOnly ? "1px solid var(--accent-primary)" : "1px solid var(--border-color)",
                }}
              >
                {showOnlineOnly && (
                  <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              Show online only
            </span>
          </label>
          <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-full" style={{ color: "var(--accent-primary)", background: "var(--accent-glow)" }}>
            {Math.max(0, onlineUsers.length - 1)}
          </span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 w-full" style={{ padding: "12px 16px" }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          className="flex flex-col gap-2"
        >
          {filteredUsers.map((user) => (
            <motion.button
              key={user._id}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center gap-4 transition-colors duration-75 rounded-2xl hover:bg-[var(--bg-glass-hover)] ${
                selectedUser?._id === user._id 
                  ? "bg-[var(--bg-tertiary)] ring-1 ring-[var(--border-color)] shadow-sm" 
                  : "bg-transparent"
              }`}
              style={{
                padding: "12px 16px",
              }}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-12 h-12 object-cover rounded-full"
                  style={{ border: "2px solid var(--border-color)" }}
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full shadow-[0_0_10px_var(--accent-glow-strong)]"
                    style={{ background: "var(--accent-primary)", border: "2px solid var(--bg-primary)" }}
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:flex flex-1 items-center justify-between min-w-0">
                <div className="text-left min-w-0">
                  <div className="font-semibold text-[14px] truncate" style={{ color: "var(--text-primary)" }}>
                    {user.fullName}
                  </div>
                  <div
                    className="text-[12px] font-medium truncate flex items-center gap-1.5 mt-0.5"
                    style={{ color: onlineUsers.includes(user._id) || typingUsers.includes(user._id) ? "var(--accent-primary)" : "var(--text-muted)" }}
                  >
                    {typingUsers.includes(user._id) ? "Typing..." : (onlineUsers.includes(user._id) ? "Online" : "Offline")}
                  </div>
                </div>
                {user.unreadCount > 0 && (
                  <span 
                    className="text-[11px] font-bold rounded-full ml-2 flex-shrink-0 flex items-center justify-center"
                    style={{ 
                      background: "var(--accent-primary)", 
                      color: "white",
                      minWidth: "20px",
                      height: "20px",
                      padding: "0 6px",
                      boxShadow: "0 2px 5px var(--accent-glow)"
                    }}
                  >
                    {user.unreadCount > 99 ? '99+' : user.unreadCount}
                  </span>
                )}
              </div>
            </motion.button>
          ))}

          {filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-[13px]"
              style={{ color: "var(--text-muted)" }}
            >
              {isSearching ? "Searching..." : (searchQuery ? "No users found" : "No active chats. Search for a friend to start chatting!")}
            </motion.div>
          )}
        </motion.div>
      </div>
    </aside>
  );
};

export default Sidebar;
