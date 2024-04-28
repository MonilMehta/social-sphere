import { Router } from "express";
import {
  getFollowers,
  getFollowings,
  toggleFollow,
} from "../controllers/follow.controller.js";

const router = Router();

router.route("/toggle/:userId").post(toggleFollow);
router.route("/followers/:userId").get(getFollowers);
router.route("/followings/:userId").get(getFollowings);

export default router;
