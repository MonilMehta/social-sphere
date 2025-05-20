import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    password: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    interests: [String],
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    searchScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
