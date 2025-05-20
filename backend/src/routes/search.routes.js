import { Router } from "express";
import {
  globalSearch,
  getRecommendedUsers,
  searchUsers,
  getTrendingHashtags,
  updateSearchIndex,
} from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Global search across users, posts, and content
router.route("/global").get(globalSearch);

// Graph-based user recommendations (main feature)
router.route("/users/recommended").get(getRecommendedUsers);

// Advanced user search with filters
router.route("/users").get(searchUsers);

// Trending hashtags
router.route("/hashtags/trending").get(getTrendingHashtags);

// Update search index (for background jobs)
router.route("/index").post(updateSearchIndex);

export default router;
