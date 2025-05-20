import { Router } from "express";
import {
  createChat,
  getChats,
  getChatById,
  addParticipants,
  removeParticipant,
  leaveChat,
  deleteChat,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Create a new chat
router.route("/").post(createChat);

// Get all chats for the current user
router.route("/").get(getChats);

// Get chat by ID
router.route("/:chatId").get(getChatById);

// Add participant to chat
router.route("/:chatId/participants").post(addParticipants);

// Remove participant from chat
router.route("/:chatId/participants/:participantId").delete(removeParticipant);

// Leave chat
router.route("/:chatId/leave").post(leaveChat);

// Delete chat (admin only)
router.route("/:chatId").delete(deleteChat);

export default router;
