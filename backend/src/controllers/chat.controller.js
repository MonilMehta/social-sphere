import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/chat.models.js";
import { Message } from "../models/message.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

// Create or get existing chat
const createChat = asyncHandler(async (req, res) => {
  const { participantId, participants: requestParticipants, isGroupChat, chatName } = req.body;

  // Handle participants array format
  let participants = [req.user._id];
  let finalIsGroupChat = isGroupChat;
  if (requestParticipants && Array.isArray(requestParticipants)) {
    // Use the participants array as other participants (don't filter current user)
    const otherParticipants = requestParticipants;

    if (otherParticipants.length === 0) {
      throw new ApiError(400, "At least one other participant is required");
    }

    // Determine if it's a group chat based on number of participants
    finalIsGroupChat = otherParticipants.length > 1;

    // Validate all participant IDs
    for (const id of otherParticipants) {
      if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, `Invalid participant ID: ${id}`);
      }
    }

    // Check if all participants exist
    const existingUsers = await User.find({ _id: { $in: otherParticipants } });
    if (existingUsers.length !== otherParticipants.length) {
      throw new ApiError(404, "One or more participants not found");
    }

    participants.push(...otherParticipants);

  } else if (participantId) {
    // Handle single participantId format (legacy support)
    if (!mongoose.isValidObjectId(participantId)) {
      throw new ApiError(400, "Invalid participant ID");
    }

    const participant = await User.findById(participantId);
    if (!participant) {
      throw new ApiError(404, "Participant not found");
    }

    participants.push(participantId);
    finalIsGroupChat = false;

  } else {
    throw new ApiError(400, "Participants or participantId is required");
  }

  // Validate group chat requirements
  if (finalIsGroupChat && (!chatName || !chatName.trim())) {
    throw new ApiError(400, "Group chat name is required");
  }

  // For one-on-one chats, check if chat already exists
  if (!finalIsGroupChat) {
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: participants, $size: 2 },
    }).populate("participants", "name username profilepic isOnline lastSeen");

    if (existingChat) {
      return res
        .status(200)
        .json(new ApiResponse(200, existingChat, "Chat already exists"));
    }
  }
  const chatData = {
    participants,
    isGroupChat: finalIsGroupChat,
    chatName: finalIsGroupChat ? chatName : null,
    groupAdmin: finalIsGroupChat ? req.user._id : null,
  };

  const chat = await Chat.create(chatData);
  const populatedChat = await Chat.findById(chat._id).populate(
    "participants",
    "name username profilepic isOnline lastSeen"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedChat, "Chat created successfully"));
});

// Get all chats for current user
const getChats = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const chats = await Chat.find({
    participants: req.user._id,
  })
    .populate("participants", "name username profilepic isOnline lastSeen")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name username",
      },
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalChats = await Chat.countDocuments({
    participants: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        chats,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalChats / limit),
          totalChats,
          hasMore: skip + chats.length < totalChats,
        },
      },
      "Chats fetched successfully"
    )
  );
});

// Get chat by ID
const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
  }).populate("participants", "name username profilepic isOnline lastSeen");

  if (!chat) {
    throw new ApiError(404, "Chat not found or access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Chat fetched successfully"));
});

// Add participants to group chat
const addParticipants = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { participantIds } = req.body;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID");
  }

  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    throw new ApiError(400, "Participant IDs array is required");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
    isGroupChat: true,
  });

  if (!chat) {
    throw new ApiError(404, "Group chat not found or access denied");
  }

  // Only group admin can add participants
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only group admin can add participants");
  }

  // Validate participant IDs
  const validParticipants = await User.find({
    _id: { $in: participantIds },
  }).select("_id");

  if (validParticipants.length !== participantIds.length) {
    throw new ApiError(400, "Some participant IDs are invalid");
  }

  // Add only new participants
  const newParticipants = participantIds.filter(
    (id) => !chat.participants.includes(id)
  );

  if (newParticipants.length === 0) {
    throw new ApiError(400, "All participants are already in the chat");
  }

  chat.participants.push(...newParticipants);
  await chat.save();

  const updatedChat = await Chat.findById(chatId).populate(
    "participants",
    "name username profilepic isOnline lastSeen"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedChat, "Participants added successfully")
    );
});

// Remove participant from group chat
const removeParticipant = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.params;

  if (!mongoose.isValidObjectId(chatId) || !mongoose.isValidObjectId(participantId)) {
    throw new ApiError(400, "Invalid chat ID or participant ID");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
    isGroupChat: true,
  });

  if (!chat) {
    throw new ApiError(404, "Group chat not found or access denied");
  }

  // Only group admin can remove participants
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only group admin can remove participants");
  }

  // Can't remove the group admin
  if (participantId === chat.groupAdmin.toString()) {
    throw new ApiError(400, "Cannot remove group admin");
  }

  if (!chat.participants.includes(participantId)) {
    throw new ApiError(400, "Participant not found in this chat");
  }

  chat.participants = chat.participants.filter(
    (id) => id.toString() !== participantId
  );
  await chat.save();

  const updatedChat = await Chat.findById(chatId).populate(
    "participants",
    "name username profilepic isOnline lastSeen"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedChat, "Participant removed successfully")
    );
});

// Leave group chat
const leaveChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user._id,
    isGroupChat: true,
  });

  if (!chat) {
    throw new ApiError(404, "Group chat not found or access denied");
  }

  // If leaving user is admin, transfer admin rights or delete chat
  if (chat.groupAdmin.toString() === req.user._id.toString()) {
    const remainingParticipants = chat.participants.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    if (remainingParticipants.length === 0) {
      // Delete chat if no participants left
      await Chat.findByIdAndDelete(chatId);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Group chat deleted"));
    } else {
      // Transfer admin to first remaining participant
      chat.groupAdmin = remainingParticipants[0];
    }
  }

  chat.participants = chat.participants.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await chat.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Left group chat successfully"));
});

// Delete chat (only for one-on-one chats or group admin)
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

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

  // For group chats, only admin can delete
  if (chat.isGroupChat && chat.groupAdmin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only group admin can delete the chat");
  }

  // Delete all messages in the chat
  await Message.deleteMany({ chat: chatId });

  // Delete the chat
  await Chat.findByIdAndDelete(chatId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
});

export {
  createChat,
  getChats,
  getChatById,
  addParticipants,
  removeParticipant,
  leaveChat,
  deleteChat,
};
