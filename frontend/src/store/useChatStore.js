import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  searchResults: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSearching: false,
  typingUsers: [], // Array of user IDs who are currently typing

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load active chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchUsers: async (query) => {
    if (!query || query.trim() === "") {
      set({ searchResults: [], isSearching: false });
      return;
    }
    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/messages/search?q=${encodeURIComponent(query)}`);
      set({ searchResults: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search users");
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),

  getMessages: async (userId) => {
    if (!userId || userId === "undefined") return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => {
        const isUserInList = state.users.some(u => u._id === selectedUser._id);
        return {
          messages: [...state.messages, res.data],
          users: isUserInList ? state.users : [...state.users, selectedUser]
        };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  reactToMessage: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions: res.data.reactions } : msg
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to react to message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Prevent multiple subscriptions if already subscribed
    if (socket.hasListeners("newMessage")) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const isMessageSentFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;
      
      if (!isMessageSentFromSelectedUser) {
        // Update unread count in sidebar if chat is not open
        set((state) => {
          const userExists = state.users.some(u => u._id === newMessage.senderId);
          
          // If a completely new person messages us, refresh the contacts list to fetch their profile & unread count
          if (!userExists) {
            get().getUsers();
            return state;
          }

          return {
            users: state.users.map((user) => 
              user._id === newMessage.senderId 
                ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
                : user
            )
          };
        });
        return;
      }

      set({
        messages: [...get().messages, newMessage],
      });

      // Delay slightly to allow the sender's HTTP request to finish and append the message to their state
      setTimeout(() => {
        socket.emit("markMessagesAsRead", { senderId: selectedUser._id });
      }, 500);
    });

    socket.on("messagesRead", ({ receiverId }) => {
      const { selectedUser } = get();
      if (selectedUser && selectedUser._id === receiverId) {
        set((state) => ({
          messages: state.messages.map((msg) => 
            msg.receiverId === receiverId ? { ...msg, isRead: true } : msg
          )
        }));
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("messageDeleted");
      socket.off("messageReaction");
    }
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("userTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: [...new Set([...state.typingUsers, senderId])]
      }));
    });

    socket.on("userStopTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: state.typingUsers.filter((id) => id !== senderId)
      }));
    });
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("userTyping");
      socket.off("userStopTyping");
    }
  },

  markMessagesAsRead: (senderId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Emit socket event to backend
    socket.emit("markMessagesAsRead", { senderId });

    // Optimistically update UI
    set((state) => ({
      messages: state.messages.map((msg) => 
        msg.senderId === senderId && msg.receiverId === useAuthStore.getState().authUser._id 
          ? { ...msg, isRead: true } 
          : msg
      ),
      users: state.users.map((user) => 
        user._id === senderId ? { ...user, unreadCount: 0 } : user
      )
    }));
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
