import { Router } from "express";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getUnreadCount,
  searchMessages,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Send a message (with optional file attachments)
router.route("/").post(upload.array("attachments", 5), sendMessage);

// Get messages for a specific chat
router.route("/chat/:chatId").get(getMessages);

// Edit a message
router.route("/:messageId").patch(editMessage);

// Delete a message
router.route("/:messageId").delete(deleteMessage);

// Get unread messages count
router.route("/unread/count").get(getUnreadCount);

// Search messages
router.route("/search").get(searchMessages);

export default router;
