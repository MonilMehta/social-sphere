import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  changePassword,
  getBookmarks,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateAccount,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("profilepic"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-account").patch(verifyJWT, upload.single("profilepic"), updateAccount);
router.route("/change-pass").post(verifyJWT, changePassword);
router.route("/bookmarks").get(getBookmarks);
router.route("/profile").get(getUserProfile);

export default router;
