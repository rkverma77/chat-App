import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X, MessageSquare, UserPlus, Check, XCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { getUsers, users, searchResults, isSearching, searchUsers, clearSearch, selectedUser, setSelectedUser, isUsersLoading, typingUsers } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { incomingRequests, outgoingRequests, friends, sendRequest, acceptRequest, rejectRequest, removeFriend } = useFriendStore();
  
  const [activeTab, setActiveTab] = useState("chats"); // 'chats', 'requests', 'search'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (activeTab !== "search") return;
    
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        clearSearch();
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchUsers, clearSearch, activeTab]);

  // Handle Tab Switch
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab !== "search") {
      setSearchQuery("");
      clearSearch();
    }
  };
  
  // Sort users (friends) so online users appear at the top
  const sortedFriends = [...users].sort((a, b) => {
    const aOnline = onlineUsers.includes(a._id);
    const bOnline = onlineUsers.includes(b._id);
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  if (isUsersLoading && activeTab === "chats") return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-80 flex flex-col transition-all duration-200"
      style={{
        background: "transparent"
      }}
    >
      <div
        className="w-full flex flex-col gap-4"
        style={{ padding: "20px 16px", borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
            >
              <Users className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
            </div>
            <span className="font-semibold text-[17px] tracking-tight hidden lg:block" style={{ color: "var(--text-primary)" }}>
              Contacts
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="hidden lg:flex items-center gap-1.5">
          <button 
            onClick={() => handleTabSwitch("chats")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 px-1.5 rounded-lg transition-all duration-200 border ${
              activeTab === "chats"
                ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--accent-primary)]"
                : "bg-transparent text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50"
            }`}
            style={{ 
              boxShadow: activeTab === "chats" ? "0 4px 12px var(--accent-glow)" : "none"
            }}
          >
            <MessageSquare size={14} />
            <span className="text-[12px] font-medium tracking-wide">Chats</span>
          </button>
          <button 
            onClick={() => handleTabSwitch("requests")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 px-1.5 rounded-lg transition-all duration-200 border relative ${
              activeTab === "requests"
                ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--accent-primary)]"
                : "bg-transparent text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50"
            }`}
            style={{ 
              boxShadow: activeTab === "requests" ? "0 4px 12px var(--accent-glow)" : "none"
            }}
          >
            <UserPlus size={14} />
            <span className="text-[12px] font-medium tracking-wide">Requests</span>
            {incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-secondary)]" style={{ background: "var(--accent-primary)", boxShadow: "0 0 8px var(--accent-primary)" }}></span>
            )}
          </button>
          <button 
            onClick={() => handleTabSwitch("search")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 px-1.5 rounded-lg transition-all duration-200 border ${
              activeTab === "search"
                ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--accent-primary)]"
                : "bg-transparent text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50"
            }`}
            style={{ 
              boxShadow: activeTab === "search" ? "0 4px 12px var(--accent-glow)" : "none"
            }}
          >
            <Search size={14} />
            <span className="text-[12px] font-medium tracking-wide">Add</span>
          </button>
        </div>
        
        {/* Search Bar (Only visible in Add tab on large screens, or globally if we want) */}
        <AnimatePresence>
          {activeTab === "search" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative hidden lg:block w-full overflow-hidden"
            >
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search size={16} style={{ color: "var(--text-muted)" }} />
              </div>
              <input
                type="text"
                placeholder="Find new friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pr-10 rounded-lg text-[13px] outline-none transition-all duration-200"
                style={{
                  paddingLeft: "38px",
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
                  className="absolute inset-y-0 right-3.5 flex items-center justify-center cursor-pointer group"
                >
                  <div 
                    className="flex items-center justify-center rounded-full w-[18px] h-[18px] border border-[var(--destructive)] bg-[var(--destructive-glow)] text-[var(--destructive)] group-hover:bg-[var(--destructive)] group-hover:text-white group-hover:scale-110 transition-all duration-200"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </div>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-y-auto flex-1 w-full" style={{ padding: "12px 16px" }}>
        
        {/* CHATS TAB */}
        {activeTab === "chats" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2"
          >
            {sortedFriends.map((user) => (
              <div
                key={user._id}
                className={`w-full flex items-center gap-4 transition-colors duration-75 rounded-2xl group ${
                  selectedUser?._id === user._id 
                    ? "bg-[var(--bg-tertiary)] ring-1 ring-[var(--border-color)] shadow-sm" 
                    : "hover:bg-[var(--bg-glass-hover)]"
                }`}
                style={{ padding: "12px 16px" }}
              >
                <button 
                  className="flex-1 flex items-center gap-4 text-left"
                  onClick={() => setSelectedUser(user)}
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
                </button>
                {/* Unfriend Button */}
                <button 
                  onClick={() => removeFriend(user._id)}
                  className="hidden lg:flex opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--destructive)] transition-all"
                  title="Remove Friend"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {sortedFriends.length === 0 && (
              <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-muted)" }}>
                No friends yet. Head to "Add" to find friends!
              </div>
            )}
          </motion.div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Incoming */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[11px] font-semibold tracking-wider uppercase ml-4" style={{ color: "var(--text-muted)" }}>Incoming ({incomingRequests.length})</h3>
              {incomingRequests.map((req) => (
                <div key={req._id} className="flex items-center gap-3 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]" style={{ padding: "12px 16px" }}>
                  <img src={req.sender.profilePic || "/avatar.png"} className="w-10 h-10 rounded-full border border-[var(--border-color)]" />
                  <div className="flex-1 min-w-0 hidden lg:block">
                    <div className="font-semibold text-[13px] truncate" style={{ color: "var(--text-primary)" }}>{req.sender.fullName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => acceptRequest(req._id)} className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--accent-primary)] border border-transparent hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] hover:shadow-[0_0_12px_var(--accent-glow)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"><Check size={14} strokeWidth={2.5} /></button>
                    <button onClick={() => rejectRequest(req._id)} className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--destructive)] border border-transparent hover:border-[var(--destructive)] hover:bg-[var(--destructive-glow)] hover:shadow-[0_0_12px_var(--destructive-glow)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"><X size={14} strokeWidth={2.5} /></button>
                  </div>
                </div>
              ))}
              {incomingRequests.length === 0 && <p className="text-[12px] ml-4 mt-1" style={{ color: "var(--text-muted)" }}>No incoming requests</p>}
            </div>

            {/* Outgoing */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[11px] font-semibold tracking-wider uppercase ml-4" style={{ color: "var(--text-muted)" }}>Outgoing ({outgoingRequests.length})</h3>
              {outgoingRequests.map((req) => (
                <div key={req._id} className="flex items-center gap-3 rounded-2xl opacity-60" style={{ padding: "12px 16px" }}>
                  <img src={req.receiver.profilePic || "/avatar.png"} className="w-10 h-10 rounded-full border border-[var(--border-color)] grayscale" />
                  <div className="flex-1 min-w-0 hidden lg:block">
                    <div className="font-semibold text-[13px] truncate" style={{ color: "var(--text-primary)" }}>{req.receiver.fullName}</div>
                    <div className="text-[11px]">Pending</div>
                  </div>
                </div>
              ))}
              {outgoingRequests.length === 0 && <p className="text-[12px] ml-4 mt-1" style={{ color: "var(--text-muted)" }}>No outgoing requests</p>}
            </div>
          </motion.div>
        )}

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2"
          >
            {isSearching ? (
              <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-muted)" }}>Searching...</div>
            ) : (
              searchResults.map((user) => {
                const isFriend = friends.some(f => f._id === user._id);
                const isIncoming = incomingRequests.some(r => r.sender._id === user._id);
                const isOutgoing = outgoingRequests.some(r => r.receiver._id === user._id);
                
                return (
                  <div key={user._id} className="flex items-center gap-3 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]" style={{ padding: "12px 16px" }}>
                    <img src={user.profilePic || "/avatar.png"} className="w-10 h-10 rounded-full border border-[var(--border-color)]" />
                    <div className="flex-1 min-w-0 hidden lg:block">
                      <div className="font-semibold text-[13px] truncate" style={{ color: "var(--text-primary)" }}>{user.fullName}</div>
                    </div>
                    <div className="hidden lg:flex flex-shrink-0 items-center ml-2">
                      {isFriend ? (
                        <span 
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full whitespace-nowrap"
                          style={{ padding: "4px 12px", background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--accent-primary)" }}
                        >
                          <Check size={12} /> Friend
                        </span>
                      ) : isOutgoing ? (
                        <span 
                          className="inline-flex items-center text-[11px] font-medium rounded-full whitespace-nowrap"
                          style={{ padding: "4px 12px", background: "var(--bg-primary)", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}
                        >
                          Sent
                        </span>
                      ) : isIncoming ? (
                        <span 
                          className="inline-flex items-center text-[11px] font-medium rounded-full whitespace-nowrap"
                          style={{ padding: "4px 12px", background: "var(--bg-primary)", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}
                        >
                          Pending
                        </span>
                      ) : (
                        <button 
                          onClick={() => sendRequest(user._id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--accent-primary)] border border-transparent hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] hover:shadow-[0_0_12px_var(--accent-glow)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                          <UserPlus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {!searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-muted)" }}>
                Type a name to search...
              </div>
            )}
            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-muted)" }}>
                No users found
              </div>
            )}
          </motion.div>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
