import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const likeController = {

    async toggleVideoLike(req, res) {
        const { videoId } = req.params;
        const userId = req.user?._id;
        //TODO: toggle like on video
        try {
            const videoLike = await Like.findOne({ video: videoId, likedBy: userId })
            if (videoLike) {
                await videoLike.deleteOne()
                return res.status(200).json(new ApiResponse(200, {}, "Video UnLiked successfully"))
            } else {
                let newVideoLike = new Like({ video: videoId, likedBy: userId })
                newVideoLike = await newVideoLike.save()
                return res.status(200).json(new ApiResponse(200, {}, "Video Liked successfully"))
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async toggleCommentLike(req, res, next) {
        const { commentId } = req.params
        const userId = req.user?._id;
        //TODO: toggle like on comment
        try {
            const commentLike = await Like.findOne({ comment: commentId, likedBy: userId })
            if (commentLike) {
                await commentLike.deleteOne()
                return res.status(200).json(new ApiResponse(200, {}, "Comment UnLiked successfully"))

            } else {
                let newCommentLike = new Like({ comment: commentId, likedBy: userId })
                newCommentLike = newCommentLike.save()
                return res.status(200).json(new ApiResponse(200, {}, "Comment Liked successfully"))
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async toggleTweetLike(req, res, next) {
        const { tweetId } = req.params;
        const userId = req.user?._id;
        //TODO: toggle like on tweet
        try {
            const tweetLike = await Like.findOne({ tweet: tweetId, likedBy: userId })
            if (tweetLike) {
                await tweetLike.deleteOne()
                return res.status(200).json(new ApiResponse(200, {}, "Tweet Unliked successfully"))
            } else {
                const newTweetLike = new Like({ tweet: tweetId, likedBy: userId })
                newTweetLike - await newTweetLike.save()
                return res.status(200).json(new ApiResponse(200, {}, "Tweet Liked successfully"))
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async getLikedVideos(req, res, next) {
        //TODO: get all liked videos
        const userId = req.user?._id;
        try {
            // const likedVideos = await Like.find({likedBy:userId}).populate("video","videoFile,thumbnail,owner")
            const likedVideos = await Like.aggregate([
                {
                    $match: { likedBy: new mongoose.Types.ObjectId(userId) },
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "video",
                        foreignField: "_id",
                        as: "video",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "owner",
                                    foreignField: "_id",
                                    as: "owner",
                                    pipeline: [
                                        {
                                            $project: {
                                                username: 1,
                                                avatar: 1,
                                                fullName: 1
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: "$owner" },
                        ]
                    }
                },
                { $unwind: "$video" },
                {
                    $project: { video: 1, _id: 0, owner: 1 }
                }
                // {
                //     $project: { video: 1, _id: 0 }
                // },

                // {
                //     $lookup: {
                //         from: "videos",
                //         localField: "video",
                //         foreignField: "_id",
                //         as: "video"
                //     }
                // },
            ])
            return res.status(200).json(new ApiResponse(200, likedVideos || [], "fetched all liked videos successfully"))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    async getVideoLikes(req, res, next) {
        const { videoId } = (req.params);
        const userId = req.user?._id;
        if (!isValidObjectId(videoId)) {
            return next(new ApiError(400, "Invalid videoId"))
        }
        try {
            const likes = await Like.aggregate([
                {
                    $match: {
                        video: new mongoose.Types.ObjectId(videoId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        likes: { $sum: 1 },
                        isLiked: {
                            $max: {
                                $cond: [{ $eq: ["$likedBy", userId] }, true, false]
                            }
                        }
                    }
                },
            ])

            return res.status(200).json(new ApiResponse(200, likes[0] || { likes: 0, isLiked: false }, "Fetched video likes successfully"))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async getCommentLikes(req, res, next) {
        const { commentId } = (req.params);
        const userId = req.user?._id;
        if (!isValidObjectId(commentId)) {
            return next(new ApiError(400, "Invalid commentId"))
        }

        try {
            const likes = await Like.aggregate([
                {
                    $match: {
                        comment: new mongoose.Types.ObjectId(commentId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        likes: { $sum: 1 },
                        isLiked: {
                            $max: {
                                $cond: [{ $eq: ["$likedBy", userId] }, true, false]
                            }
                        }
                    }
                }
            ])

            res.status(200).json(new ApiResponse(200, likes[0] || { likes: 0, isLiked: false }, "Fetched comment likes successfully"))
        } catch (error) {
            next(error)
        }
    },

    async getTweetLikes(req, res, next) {
        const { tweetId } = req.params;
        const userId = new mongoose.Types.ObjectId(req?.user._id)
        if (!isValidObjectId(tweetId)) {
            return next(new ApiError(400, "Invalid tweetId"))
        }
        try {
            const likes = await Like.aggregate([
                {
                    $match: {
                        tweet: new mongoose.Types.ObjectId(tweetId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        likes: { $sum: 1 },
                        isLiked: {
                            $max: {
                                $cond: [{ $eq: ["$likedBy", userId] }, true, false]
                            }
                        }
                    }
                }
            ])

            res.status(200).json(new ApiResponse(200, likes[0] || { likes: 0, isLiked: false }, "Fetched tweet likes successfully"))
        } catch (error) {
            next(error)
        }
    }

}

export default likeController