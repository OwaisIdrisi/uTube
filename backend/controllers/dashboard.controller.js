import mongoose from "mongoose"
import { Video } from "../models/video.js"
import { Subscription } from "../models/subscription.js"
// import { Like } from "./like.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const getChannelStats = async (req, res, next) => {
    const userId = req.user._id;
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    try {
        // TODO: to be implemented
    } catch (error) {
        next(error)
    }
}

const getChannelVideos = async (req, res, next) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;
    try {
        const channelVideos = await Video.find({ owner: userId })
        return res.status(200).json(new ApiResponse(200, channelVideos, "fetched all videos uploaded by the channel successfully"))
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export {
    getChannelStats,
    getChannelVideos
}