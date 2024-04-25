import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/p/:postId").get(getComments).post(createComment);
router.route("/c/:commentId").patch(updateComment).delete(deleteComment);

export default router;
