import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Post } from "../models/post.models.js";
import { Follow } from "../models/follow.models.js";
import { SearchIndex } from "../models/search.models.js";
import mongoose from "mongoose";

// Global search across users, posts, and content
const globalSearch = asyncHandler(async (req, res) => {
  const { query, type = "all", page = 1, limit = 20 } = req.query;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const skip = (page - 1) * limit;
  const searchQuery = query.trim();
  const results = {};

  try {
    if (type === "all" || type === "users") {
      // Search users
      const users = await User.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { username: { $regex: searchQuery, $options: "i" } },
          { bio: { $regex: searchQuery, $options: "i" } },
          { interests: { $in: [new RegExp(searchQuery, "i")] } },
        ],
      })
        .select("name username profilepic bio isVerified")
        .limit(Number(limit))
        .skip(skip);

      results.users = users;
    }

    if (type === "all" || type === "posts") {
      // Search posts
      const posts = await Post.aggregate([
        {
          $match: {
            caption: { $regex: searchQuery, $options: "i" },
            isPublic: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy",
            pipeline: [
              {
                $project: {
                  name: 1,
                  username: 1,
                  profilepic: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            postedBy: { $first: "$postedBy" },
          },
        },
        { $skip: skip },
        { $limit: Number(limit) },
      ]);

      results.posts = posts;
    }

    if (type === "all" || type === "hashtags") {
      // Extract hashtags from the query
      const hashtagMatches = searchQuery.match(/#\w+/g);
      if (hashtagMatches) {
        const hashtags = hashtagMatches.map(tag => tag.substring(1));
        results.hashtags = hashtags;
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, results, "Search completed successfully"));
  } catch (error) {
    console.error("Search error:", error);
    throw new ApiError(500, "Search failed");
  }
});

// Graph-based user recommendations
const getRecommendedUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const currentUserId = req.user._id;

  try {
    // Multi-layered recommendation algorithm
    const recommendations = await User.aggregate([
      // Exclude current user and already followed users
      {
        $match: {
          _id: { $ne: currentUserId },
        },
      },
      // Get users the current user is already following
      {
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$following", "$$userId"] },
                    { $eq: ["$follower", currentUserId] },
                  ],
                },
              },
            },
          ],
          as: "alreadyFollowing",
        },
      },
      // Exclude already followed users
      {
        $match: {
          alreadyFollowing: { $size: 0 },
        },
      },
      // Calculate mutual followers (friends of friends)
      {
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$following", "$$userId"] },
              },
            },
            {
              $lookup: {
                from: "follows",
                let: { follower: "$follower" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$follower", currentUserId] },
                          { $eq: ["$following", "$$follower"] },
                        ],
                      },
                    },
                  },
                ],
                as: "mutualConnection",
              },
            },
            {
              $match: {
                mutualConnection: { $size: { $gt: 0 } },
              },
            },
          ],
          as: "mutualFollowers",
        },
      },
      // Calculate interest similarity
      {
        $lookup: {
          from: "users",
          let: { userInterests: "$interests" },
          pipeline: [
            {
              $match: {
                _id: currentUserId,
              },
            },
            {
              $project: {
                commonInterests: {
                  $size: {
                    $ifNull: [
                      {
                        $setIntersection: ["$interests", "$$userInterests"],
                      },
                      [],
                    ],
                  },
                },
              },
            },
          ],
          as: "interestMatch",
        },
      },
      // Calculate location similarity
      {
        $lookup: {
          from: "users",
          let: { userLocation: "$location" },
          pipeline: [
            {
              $match: {
                _id: currentUserId,
              },
            },
            {
              $project: {
                locationMatch: {
                  $cond: {
                    if: {
                      $and: [
                        { $ne: ["$location", null] },
                        { $ne: ["$$userLocation", null] },
                        { $eq: ["$location", "$$userLocation"] },
                      ],
                    },
                    then: 5,
                    else: 0,
                  },
                },
              },
            },
          ],
          as: "locationSimilarity",
        },
      },
      // Get follower counts for popularity score
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
          as: "followers",
        },
      },
      // Calculate recommendation score
      {
        $addFields: {
          mutualFollowersCount: { $size: "$mutualFollowers" },
          followerCount: { $size: "$followers" },
          commonInterests: {
            $ifNull: [{ $first: "$interestMatch.commonInterests" }, 0],
          },
          locationBonus: {
            $ifNull: [{ $first: "$locationSimilarity.locationMatch" }, 0],
          },
          recommendationScore: {
            $add: [
              // Mutual followers weight (highest priority)
              { $multiply: [{ $size: "$mutualFollowers" }, 10] },
              // Common interests weight
              {
                $multiply: [
                  { $ifNull: [{ $first: "$interestMatch.commonInterests" }, 0] },
                  5,
                ],
              },
              // Location similarity weight
              { $ifNull: [{ $first: "$locationSimilarity.locationMatch" }, 0] },
              // Popularity score (follower count with diminishing returns)
              { $sqrt: { $size: "$followers" } },
              // Account age bonus
              {
                $divide: [
                  {
                    $subtract: [
                      new Date(),
                      { $ifNull: ["$createdAt", new Date()] },
                    ],
                  },
                  86400000, // Convert to days
                ],
              },
              // Verified user bonus
              { $cond: { if: "$isVerified", then: 3, else: 0 } },
            ],
          },
        },
      },
      // Sort by recommendation score
      {
        $sort: {
          recommendationScore: -1,
          followerCount: -1,
          createdAt: -1,
        },
      },
      // Project final fields
      {
        $project: {
          name: 1,
          username: 1,
          profilepic: 1,
          bio: 1,
          isVerified: 1,
          followerCount: 1,
          mutualFollowersCount: 1,
          commonInterests: 1,
          location: 1,
          recommendationScore: 1,
        },
      },
      { $skip: skip },
      { $limit: Number(limit) },
    ]);

    const totalUsers = await User.countDocuments({
      _id: { $ne: currentUserId },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users: recommendations,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            hasMore: skip + recommendations.length < totalUsers,
          },
        },
        "User recommendations fetched successfully"
      )
    );
  } catch (error) {
    console.error("Recommendation error:", error);
    throw new ApiError(500, "Failed to get user recommendations");
  }
});

// Search users with filters
const searchUsers = asyncHandler(async (req, res) => {
  const {
    query,
    location,
    interests,
    isVerified,
    page = 1,
    limit = 20,
  } = req.query;

  const skip = (page - 1) * limit;
  const searchFilters = {};

  // Text search
  if (query && query.trim()) {
    searchFilters.$or = [
      { name: { $regex: query.trim(), $options: "i" } },
      { username: { $regex: query.trim(), $options: "i" } },
      { bio: { $regex: query.trim(), $options: "i" } },
    ];
  }

  // Location filter
  if (location) {
    searchFilters.location = { $regex: location, $options: "i" };
  }

  // Interests filter
  if (interests) {
    const interestArray = interests.split(",").map(i => i.trim());
    searchFilters.interests = { $in: interestArray };
  }

  // Verified filter
  if (isVerified !== undefined) {
    searchFilters.isVerified = isVerified === "true";
  }

  // Exclude current user
  searchFilters._id = { $ne: req.user._id };

  const users = await User.aggregate([
    { $match: searchFilters },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "follows",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$following", "$$userId"] },
                  { $eq: ["$follower", req.user._id] },
                ],
              },
            },
          },
        ],
        as: "isFollowing",
      },
    },
    {
      $addFields: {
        followerCount: { $size: "$followers" },
        isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] },
      },
    },
    {
      $project: {
        name: 1,
        username: 1,
        profilepic: 1,
        bio: 1,
        location: 1,
        interests: 1,
        isVerified: 1,
        followerCount: 1,
        isFollowing: 1,
      },
    },
    { $sort: { followerCount: -1, name: 1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  const totalUsers = await User.countDocuments(searchFilters);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasMore: skip + users.length < totalUsers,
        },
      },
      "User search completed successfully"
    )
  );
});

// Trending hashtags
const getTrendingHashtags = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const trendingHashtags = await Post.aggregate([
    {
      $match: {
        isPublic: true,
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    },
    {
      $project: {
        hashtags: {
          $regexFindAll: {
            input: "$caption",
            regex: /#\w+/g,
          },
        },
      },
    },
    {
      $unwind: "$hashtags",
    },
    {
      $group: {
        _id: { $toLower: "$hashtags.match" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: Number(limit),
    },
    {
      $project: {
        hashtag: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, trendingHashtags, "Trending hashtags fetched successfully")
    );
});

// Update search index (helper function for background jobs)
const updateSearchIndex = asyncHandler(async (req, res) => {
  const { contentType, contentId, searchableText, tags = [] } = req.body;

  if (!contentType || !contentId || !searchableText) {
    throw new ApiError(400, "Content type, ID, and searchable text are required");
  }

  try {
    await SearchIndex.findOneAndUpdate(
      { contentType, contentId },
      {
        contentType,
        contentId,
        searchableText: searchableText.toLowerCase(),
        tags: tags.map(tag => tag.toLowerCase()),
        metadata: req.body.metadata || {},
      },
      { upsert: true, new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Search index updated successfully"));
  } catch (error) {
    console.error("Search index update error:", error);
    throw new ApiError(500, "Failed to update search index");
  }
});

export {
  globalSearch,
  getRecommendedUsers,
  searchUsers,
  getTrendingHashtags,
  updateSearchIndex,
};
