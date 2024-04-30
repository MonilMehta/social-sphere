import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  togglePostToBookmark,
  togglePublicStatus,
  updatePost,
} from "../controllers/post.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllPosts)
  .post(upload.array("mediaFile", 10), createPost);

router.route("/:postId").get(getPostById).patch(updatePost).delete(deletePost);

router.route("/toggle/:postId").patch(togglePublicStatus);

router.route("/bookmark/:postId").patch(togglePostToBookmark)

export default router;
