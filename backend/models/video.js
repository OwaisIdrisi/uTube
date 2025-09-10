import mongoose, { Schema } from "mongoose";

const videoSchema = Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    viewedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        lastViewedAt: {
            type: Date,
        }
    }]
}, {
    timestamps: true
})

export const Video = mongoose.model("Video", videoSchema)