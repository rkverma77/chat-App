import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getFriends,
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFriends);
router.get("/requests", protectRoute, getPendingRequests);
router.post("/request/:id", protectRoute, sendFriendRequest);
router.put("/accept/:requestId", protectRoute, acceptFriendRequest);
router.put("/reject/:requestId", protectRoute, rejectFriendRequest);
router.delete("/remove/:id", protectRoute, removeFriend);

export default router;
