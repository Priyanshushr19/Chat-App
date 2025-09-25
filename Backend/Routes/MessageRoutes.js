import express from "express";
import { protectRoute } from "../Middleware/Auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controller/MessageController.js";

const messageRouter = express.Router();

// Get all users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get all messages between logged-in user and selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark a specific message as seen
messageRouter.patch("/mark/:id", protectRoute, markMessageAsSeen);

// Send a new message to a specific user
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
