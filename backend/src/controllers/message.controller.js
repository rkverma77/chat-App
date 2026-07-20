import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).populate("friends", "-password").lean();
    
    const friends = user.friends || [];

    // Fetch unread message counts for each friend
    const usersWithUnreadCounts = await Promise.all(
      friends.map(async (friend) => {
        const unreadCount = await Message.countDocuments({
          senderId: friend._id,
          receiverId: loggedInUserId,
          isRead: { $ne: true },
        });
        return { ...friend, unreadCount };
      })
    );

    res.status(200).json(usersWithUnreadCounts);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const loggedInUserId = req.user._id;

    if (!q || q.trim() === "") {
      return res.status(200).json([]);
    }

    // Search by fullName or email (Unique ID) using regex
    const users = await User.find({
      _id: { $ne: loggedInUserId },
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("-password").limit(10).lean();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const sender = await User.findById(senderId);
    if (!sender.friends.includes(receiverId)) {
      return res.status(403).json({ error: "You can only send messages to your friends" });
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const myId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify sender
    if (message.senderId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    // Emit socket event to the receiver
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    res.status(200).json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ message: "Emoji is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Toggle logic: check if this user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReactionIndex !== -1) {
      // Remove reaction if it already exists
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add new reaction
      message.reactions.push({ emoji, userId });
    }

    await message.save();

    // Determine who to notify
    // If I react to my own message, notify the receiver
    // If I react to the other person's message, notify the sender
    const notifyUserId = message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId;
    
    const notifySocketId = getReceiverSocketId(notifyUserId);
    if (notifySocketId) {
      io.to(notifySocketId).emit("messageReaction", { messageId, reactions: message.reactions });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in reactToMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
