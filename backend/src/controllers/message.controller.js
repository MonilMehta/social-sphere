import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";
import mongoose from "mongoose";

// Send message
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content, messageType = "text", replyTo } = req.body;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or access denied");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Message content is required");
  }

  const messageData = {
    sender: req.user._id,
    chat: chatId,
    content: content.trim(),
    messageType,
  };

  if (replyTo && mongoose.isValidObjectId(replyTo)) {
    const replyMessage = await Message.findOne({
      _id: replyTo,
      chat: chatId,
    });
    if (replyMessage) {
      messageData.replyTo = replyTo;
    }
  }

  const message = await Message.create(messageData);

  // Update chat's last message
  chat.lastMessage = message._id;
  await chat.save();

  // Populate message with sender details
  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name username profilepic")
    .populate("replyTo", "content sender");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedMessage, "Message sent successfully"));
});

// Get messages for a chat
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or access denied");
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    chat: chatId,
    isDeleted: false,
  })
    .populate("sender", "name username profilepic")
    .populate("replyTo", "content sender")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalMessages = await Message.countDocuments({
    chat: chatId,
    isDeleted: false,
  });

  // Mark messages as read
  await Message.updateMany(
    {
      chat: chatId,
      sender: { $ne: req.user._id },
      "readBy.user": { $ne: req.user._id },
    },
    {
      $addToSet: {
        readBy: {
          user: req.user._id,
          readAt: new Date(),
        },
      },
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasMore: skip + messages.length < totalMessages,
        },
      },
      "Messages fetched successfully"
    )
  );
});

// Edit message
const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(messageId)) {
    throw new ApiError(400, "Invalid message ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Message content is required");
  }

  const message = await Message.findOne({
    _id: messageId,
    sender: req.user._id,
    isDeleted: false,
  });

  if (!message) {
    throw new ApiError(404, "Message not found or access denied");
  }

  // Can only edit text messages
  if (message.messageType !== "text") {
    throw new ApiError(400, "Only text messages can be edited");
  }

  message.content = content.trim();
  message.isEdited = true;
  message.editedAt = new Date();
  await message.save();

  const updatedMessage = await Message.findById(messageId)
    .populate("sender", "name username profilepic")
    .populate("replyTo", "content sender");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedMessage, "Message updated successfully"));
});

// Delete message
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  if (!mongoose.isValidObjectId(messageId)) {
    throw new ApiError(400, "Invalid message ID");
  }

  const message = await Message.findOne({
    _id: messageId,
    sender: req.user._id,
    isDeleted: false,
  });

  if (!message) {
    throw new ApiError(404, "Message not found or access denied");
  }

  message.isDeleted = true;
  message.content = "This message was deleted";
  await message.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted successfully"));
});

// Get unread message count
const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Message.aggregate([
    {
      $match: {
        sender: { $ne: req.user._id },
        "readBy.user": { $ne: req.user._id },
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "chats",
        localField: "chat",
        foreignField: "_id",
        as: "chatInfo",
      },
    },
    {
      $match: {
        "chatInfo.participants": req.user._id,
      },
    },
    {
      $group: {
        _id: "$chat",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalUnread: { $sum: "$count" },
        chatsWithUnread: { $sum: 1 },
      },
    },
  ]);

  const result = unreadCount[0] || { totalUnread: 0, chatsWithUnread: 0 };

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Unread message count fetched successfully")
    );
});

// Search messages
const searchMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { query, page = 1, limit = 20 } = req.query;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID");
  }

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or access denied");
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    chat: chatId,
    content: { $regex: query, $options: "i" },
    isDeleted: false,
  })
    .populate("sender", "name username profilepic")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalResults = await Message.countDocuments({
    chat: chatId,
    content: { $regex: query, $options: "i" },
    isDeleted: false,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalResults / limit),
          totalResults,
          hasMore: skip + messages.length < totalResults,
        },
      },
      "Messages search completed"
    )
  );
});

export {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getUnreadCount,
  searchMessages,
};
