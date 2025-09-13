import mongoose from "mongoose"
import { Comment } from "../models/comment.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const commentController = {
    async getVideoComments(req, res, next) {
        //TODO: get all comments for a video
        const { videoId } = req.params
        const { page = 1, limit = 10 } = req.query
        let skip_docs = Number(limit * (page - 1))
        try {
            // const comments = await Comment.find({ video: videoId }).limit(limit).skip(skip_docs)
            const comments = await Comment.aggregate([
                {
                    $match: {
                        video: new mongoose.Types.ObjectId(videoId)
                    }
                },
                {
                    $project: {
                        content: 1, video: 1, owner: 1,
                        createdAt: 1, updatedAt: 1
                    }
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "video",
                        foreignField: "_id",
                        as: "video",
                        pipeline: [
                            {
                                $project: {
                                    title: 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$video" },
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
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$owner" },


            ]).limit(limit).skip(skip_docs)
            const totalDocs = await Comment.find({ video: videoId }).countDocuments()
            const totalPage = Math.ceil(totalDocs / limit)

            return res.status(200).json(new ApiResponse(200, {
                comments, pagination: {
                    totalDocs: Number(totalDocs) || 0,
                    totalPage: totalPage || 0,
                    page: Number(page) || 1,
                    limit: Number(limit) || 10
                }
            }))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async addComment(req, res, next) {
        // TODO: add a comment to a video
        const { videoId } = req.params
        const userId = req.user._id
        const content = req.body?.content
        try {
            let comment = new Comment({ content, video: videoId, owner: userId })
            comment = await comment.save()
            return res.status(201).json(new ApiResponse(201, { comment }, "comment added successfully"))

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async updateComment(req, res, next) {
        // TODO: update a comment
        const { commentId } = req.params
        const content = req.body.content
        try {
            const comment = await Comment.findOneAndUpdate({ _id: commentId, owner: req.user._id }, {
                $set: {
                    content
                }
            }, { new: true })
            if (!comment) {
                return res.status(403).json(new ApiResponse(403, {}, "Not authorized"))
            }
            return res.status(200).json(new ApiResponse(200, comment, "comment updated successfully"))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    async deleteComment(req, res, next) {
        // TODO: delete a comment
        const { commentId } = req.params
        try {
            const comment = await Comment.findOneAndDelete({ _id: commentId, owner: req.user._id })
            return res.status(200).json(new ApiResponse(200, {}, "comment deleted successfully"))
        } catch (error) {
            next(error)
        }
    },

    async addTweetComment(req, res, next) {
        // TODO: add a comment to a video
        const { tweetId } = req.params
        const userId = req.user._id
        const content = req.body?.content
        try {
            let comment = new Comment({ content, tweet: tweetId, owner: userId })
            comment = await comment.save()
            return res.status(201).json(new ApiResponse(201, { comment }, "comment added successfully"))

        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    async getTweetComments(req, res, next) {
        const { tweetId } = req.params
        const { page = 1, limit = 10 } = req.query
        let skip_docs = Number(limit * (page - 1))
        try {
            const comments = await Comment.aggregate([
                {
                    $match: {
                        tweet: new mongoose.Types.ObjectId(tweetId)
                    }
                },
                {
                    $lookup: {
                        from: "tweets",
                        localField: "tweet",
                        foreignField: "_id",
                        as: "tweet",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$tweet" },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$owner" },
            ]).limit(limit).skip(skip_docs)
            const totalDocs = await Comment.find({ tweet: tweetId }).countDocuments()
            const totalPage = Math.ceil(totalDocs / limit)
            return res.status(200).json(new ApiResponse(200, {
                comments, pagination: {
                    totalDocs: Number(totalDocs) || 0,
                    totalPage: totalPage || 0,
                    page: Number(page) || 1,
                    limit: Number(limit) || 10
                }
            }), "comments fetched successfully")
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}

export default commentController