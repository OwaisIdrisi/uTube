import { Subscription } from "../models/subscription.js"
import { User } from "../models/user.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.js"
import mongoose from "mongoose"

const userController = {
    async getUserChannelProfile(req, res, next) {
        const { username } = req.params
        if (!username?.trim()) throw new ApiError(400, "Username is missing")
        try {
            const channel = await User.aggregate([
                {
                    $match: {
                        username: username?.toLowerCase()
                    }
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "channel",
                        as: "subscribers"
                    }
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "subscriber",
                        as: "subscribedTo"
                    }
                },
                {
                    $addFields: {
                        subscribersCount: {
                            $size: "$subscribers"
                        },
                        channelSubscriberTo: {
                            $size: "$subscribedTo"
                        },
                        isSubscribed: {
                            $cond: {
                                if: { $in: [req.user._id, "$subscribers.subscriber"] },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $project: {
                        fullName: 1,
                        username: 1,
                        email: 1,
                        avatar: 1,
                        coverImage: 1,
                        subscribersCount: 1,
                        channelSubscriberTo: 1,
                        isSubscribed: 1

                    }
                }

            ])
            // const userVideos = await Video.aggregate([
            //     {
            //         $match: {

            //         }
            //     }
            // ])
            if (!channel?.length) throw new ApiError(404, "Channel does not exists")
            console.log(channel);

            return res.status(200).json(new ApiResponse(200, channel[0] || {}, "Channel fetched successfully"))
        } catch (error) {
            next(error)
        }
    },
    async createChannel(req, res, next) {
        try {
            const channel = new Subscription({

            })
        } catch (error) {

        }
    },
    async subscribeChannel(req, res, next) {
        const { channelUserId } = req.body
        if (!channelUserId || !req.user?._id) throw new ApiError(400, "details not provided")
        try {

            let subscription = new Subscription({
                channel: channelUserId,
                subscriber: req.user?._id
            })
            subscription = await subscription.save()
            res.status(200).json(new ApiResponse(200, { subscription }, "Channel subscribed successfully"))
        } catch (error) {
            next(error)
        }
    },
    async getWatchHistory(req, res, next) {
        try {
            const user = await User.aggregate([
                {
                    $match: {
                        _id: req.user?._id
                    }
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "watchHistory",
                        foreignField: "_id",
                        as: "watchHistory",
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
                            {
                                $addFields: {
                                    owner: {
                                        $first: "$owner"
                                    }
                                }
                            }
                        ]
                    }
                }
            ])
        } catch (error) {
            next(error)
        }
    },

    // async getUserProfile(req, res, next) {
    //     const userId = new mongoose.Types.ObjectId(req.user?._id);
    //     try {
    //         const userVideos = await Video.aggregate([
    //             {
    //                 $match: {
    //                     owner: userId
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: "users",
    //                     localField: "owner",
    //                     foreignField: "_id",
    //                     as: "owner",
    //                     pipeline: [
    //                         {
    //                             $project: {
    //                                 avatar: 1,
    //                                 username: 1,
    //                                 fullName: 1
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //         ])

    //     } catch (error) {
    //         console.log(error);
    //         next(error)
    //     }
    // }

}

export default userController