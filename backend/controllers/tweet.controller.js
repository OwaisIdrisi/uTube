import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.js"
import { User } from "../models/user.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.js"
import { Like } from "../models/like.js"


const tweetController = {
    async getAllTweets(req, res, next) {
        try {
            const tweets = await Tweet.find().populate("owner", "username fullName avatar").sort({ createdAt: -1 })
            return res.status(200).json(new ApiResponse(200, { tweets }, "tweets fetched successfully"))
        } catch (error) {
            next(error)
        }
    },
    async createTweet(req, res, next) {
        //TODO: create tweet
        const content = req.body?.content
        if (!content) throw new ApiError(400, "content is required")
        if (content.length < 20) throw new ApiError(400, "content length should be greater than 20 characters")
        try {
            let tweet = new Tweet({
                content, owner: req.user?._id
            })
            tweet = await tweet.save()
            return res.status(201).json(new ApiResponse(201, { tweet }, "tweet created successfully"))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async getUserTweets(req, res, next) {
        // TODO: get user tweets
        const { userId } = req.params
        if (!userId) throw new ApiError(400, "userId is required")
        try {
            const tweets = await Tweet.find({ owner: userId }).populate("owner", "username fullName avatar").sort({ createdAt: -1 })
            console.log(tweets);

            return res.status(200).json(new ApiResponse(200, { tweets }, "tweets fetched successfully"))
        } catch (error) {
            next(error)
        }
    },

    async updateTweet(req, res, next) {
        //TODO: update tweet
        const { tweetId } = req.params
        const content = req.body?.content
        if (!content) throw new ApiError(400, "content connot be empty")
        if (!tweetId) throw new ApiError(400, "tweet cannot update")
        try {
            let tweet = await Tweet.findById(tweetId)
            tweet.content = content
            tweet = await tweet.save()
            return res.status(200).json(new ApiResponse(200, { tweet }, "tweet updated successfully"))
        } catch (error) {
            next(error)
        }
    },
    async deleteTweet(req, res, next) {
        //TODO: delete tweet
        const { tweetId } = req.params
        if (!tweetId) throw new ApiError(400, "tweetId is required")
        try {
            const tweet = await Tweet.findByIdAndDelete(tweetId)
            return res.status(200).json(new ApiResponse(200, {}, "tweet deleted successfully"))
        } catch (error) {
            next(error)
        }
    },

    // async getTweet(req, res, next) {
    //     const { tweetId } = req.params
    //     const userId = req.user?._id
    //     try {
    //         const tweet = await Tweet.findById(tweetId).populate("owner", "avatar username fullName")
    //         return res.status(200).json(new ApiResponse(200, tweet || {}, "tweet fetched successfully"))
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    async getTweetDetails(req, res, next) {

        const { tweetId } = req.params
        const userId = new mongoose.Types.ObjectId(req.user?._id)
        if (!isValidObjectId(userId)) throw new ApiError(403, "Invalid userId")

        try {
            const tweet = await Tweet.findById(tweetId).populate("owner", "avatar username fullname")
            if (!tweet) {
                throw new ApiError(404, "Tweet not found")
            }

            const comment = await Comment.find({ tweet: tweetId })
            const likes = await Like.aggregate([
                {
                    $match: { tweet: tweet._id }
                }, {
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

            return res.status(200).json(new ApiResponse(200, { tweet, comment, likes: likes[0] || { likes: 0, isLiked: false } }))
        } catch (error) {
            next(error)
        }
    }

}

export default tweetController