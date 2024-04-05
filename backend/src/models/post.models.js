import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        imageFile:[
            {
                type: String,
            }
        ],
        videoFile:[
            {
                type: String,
            }
        ],
        description:{
            type: String,
        },
        postedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPublic:{
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Post = mongoose.model("Post", postSchema);