import { Router } from "express";
import {
  addReply,
  deleteReply,
  getReplies,
  updateReply,
} from "../controllers/reply.controller.js";

const router = Router();

router.route("/c/:commentId").get(getReplies).post(addReply);
router.route("/r/:replyId").patch(updateReply).delete(deleteReply);

export default router;
