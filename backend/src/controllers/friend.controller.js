import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getFriends = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId).populate("friends", "-password");
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getFriends controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const incomingRequests = await FriendRequest.find({ receiver: loggedInUserId, status: "pending" }).populate("sender", "-password");
    const outgoingRequests = await FriendRequest.find({ sender: loggedInUserId, status: "pending" }).populate("receiver", "-password");
    
    res.status(200).json({ incoming: incomingRequests, outgoing: outgoingRequests });
  } catch (error) {
    console.error("Error in getPendingRequests controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ error: "You cannot send a friend request to yourself" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({ error: "You are already friends" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ error: "Friend request already exists" });
      }
      // If rejected previously, we could allow resending, but let's just update it
      if (existingRequest.status === "rejected") {
        existingRequest.status = "pending";
        existingRequest.sender = senderId;
        existingRequest.receiver = receiverId;
        await existingRequest.save();
        
        const populatedRequest = await FriendRequest.findById(existingRequest._id)
          .populate("sender", "-password")
          .populate("receiver", "-password");
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newFriendRequest", populatedRequest);
        }
        return res.status(200).json(populatedRequest);
      }
    }

    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await newRequest.save();
    
    const populatedRequest = await FriendRequest.findById(newRequest._id)
      .populate("sender", "-password")
      .populate("receiver", "-password");

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", populatedRequest);
    }

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized to accept this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    request.status = "accepted";
    await request.save();

    // Add to each other's friends list
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

    const senderSocketId = getReceiverSocketId(request.sender);
    if (senderSocketId) {
      io.to(senderSocketId).emit("friendRequestAccepted", { requestId, newFriendId: request.receiver });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Error in acceptFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized to reject this request" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    console.error("Error in rejectFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
    
    // Also remove any friend request document to clean up
    await FriendRequest.deleteMany({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    });

    const friendSocketId = getReceiverSocketId(friendId);
    if (friendSocketId) {
      io.to(friendSocketId).emit("friendRemoved", { removedFriendId: userId });
    }

    res.status(200).json({ message: "Friend removed successfully", friendId });
  } catch (error) {
    console.error("Error in removeFriend controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
