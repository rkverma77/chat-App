import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useFriendStore = create((set, get) => ({
  friends: [],
  incomingRequests: [],
  outgoingRequests: [],
  isFriendsLoading: false,
  isRequestsLoading: false,

  getFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.error || "Failed to fetch friends");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  getPendingRequests: async () => {
    set({ isRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ incomingRequests: res.data.incoming, outgoingRequests: res.data.outgoing });
    } catch (error) {
      toast.error(error.response.data.error || "Failed to fetch requests");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  sendRequest: async (userId) => {
    try {
      const res = await axiosInstance.post(`/friends/request/${userId}`);
      set((state) => ({ outgoingRequests: [...state.outgoingRequests, res.data] }));
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error.response.data.error || "Failed to send request");
    }
  },

  acceptRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/friends/accept/${requestId}`);
      set((state) => ({
        incomingRequests: state.incomingRequests.filter((req) => req._id !== requestId),
      }));
      get().getFriends(); // Refresh friends list
      useChatStore.getState().getUsers(); // Refresh sidebar users
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error(error.response.data.error || "Failed to accept request");
    }
  },

  rejectRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/friends/reject/${requestId}`);
      set((state) => ({
        incomingRequests: state.incomingRequests.filter((req) => req._id !== requestId),
      }));
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error(error.response.data.error || "Failed to reject request");
    }
  },

  removeFriend: async (userId) => {
    try {
      await axiosInstance.delete(`/friends/remove/${userId}`);
      set((state) => ({
        friends: state.friends.filter((friend) => friend._id !== userId),
      }));
      useChatStore.getState().getUsers(); // Refresh sidebar users
      
      const { selectedUser, setSelectedUser } = useChatStore.getState();
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
      }
      toast.success("Friend removed");
    } catch (error) {
      toast.error(error.response.data.error || "Failed to remove friend");
    }
  },

  subscribeToFriendEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newFriendRequest", (newRequest) => {
      set((state) => ({
        incomingRequests: [...state.incomingRequests, newRequest],
      }));
      toast.success(`New friend request from ${newRequest.sender.fullName}`);
    });

    socket.on("friendRequestAccepted", ({ requestId, newFriendId }) => {
      // Remove from outgoing requests
      set((state) => ({
        outgoingRequests: state.outgoingRequests.filter((req) => req._id !== requestId),
      }));
      // Fetch fresh friends list
      get().getFriends();
      useChatStore.getState().getUsers(); // Refresh sidebar users
      toast.success("A friend request was accepted!");
    });

    socket.on("friendRemoved", ({ removedFriendId }) => {
      set((state) => ({
        friends: state.friends.filter((friend) => friend._id !== removedFriendId),
      }));
      useChatStore.getState().getUsers();
      const { selectedUser, setSelectedUser } = useChatStore.getState();
      if (selectedUser?._id === removedFriendId) {
        setSelectedUser(null);
      }
    });
  },

  unsubscribeFromFriendEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");
    socket.off("friendRemoved");
  }
}));
