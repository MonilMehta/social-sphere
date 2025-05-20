import mongoose from "mongoose";

const searchIndexSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["user", "post", "comment"],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    searchableText: {
      type: String,
      required: true,
    },
    tags: [String],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for full-text search
searchIndexSchema.index({ searchableText: "text", tags: "text" });
searchIndexSchema.index({ contentType: 1, contentId: 1 }, { unique: true });

export const SearchIndex = mongoose.model("SearchIndex", searchIndexSchema);
