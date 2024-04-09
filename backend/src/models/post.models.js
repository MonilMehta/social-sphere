import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    mediaFile: [
      {
        type: String,
      },
    ],
    caption: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
