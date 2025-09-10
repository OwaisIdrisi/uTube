import mongoose, { isValidObjectId } from "mongoose"
import { Subscription } from "../models/subscription.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const subscriptionController = {
    async toggleSubscription(req, res, next) {
        // TODO: toggle subscription
        //  ✅ toggleSubscription
        // Checks if a subscription exists.
        // If yes → deletes (unsubscribe).
        // If no → creates new (subscribe).
        //  use of findOne, deleteOne, and save().
        const { channelId } = req.params
        const userId = req.user?._id
        console.log("channelId", channelId);
        console.log("userId", userId);

        if (channelId.toString() === userId.toString()) {
            throw new ApiError(400, "You cannot subscribe to your own channel");
        }


        try {
            let existingSub = await Subscription.findOne({ channel: channelId, subscriber: userId })

            if (existingSub) {
                await existingSub.deleteOne()
                return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"))
            } else {
                let subscription = new Subscription({ channel: channelId, subscriber: userId })
                let newSubs = await subscription.save()
                console.log(newSubs);
                return res.status(201).json(new ApiResponse(201, newSubs, "subscribed successfully"))
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    // controller to return subscriber list of a channel
    async getUserChannelSubscribers(req, res, next) {
        //✅ getUserChannelSubscribers
        // Finds all subscribers of a channel.
        // $lookup → joins channel & subscriber details.
        // $unwind → flattens lookup results.
        // $group → combines into { channel, subscribers[], subsCount }.
        const { channelId } = req.params
        try {
            const subscribers = await Subscription.aggregate([
                {
                    $match: {
                        channel: new mongoose.Types.ObjectId(channelId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "channel",
                        foreignField: "_id",
                        as: "channel",
                        pipeline: [{
                            $project: {
                                username: 1,
                                fullName: 1
                            }
                        }]
                    }
                },
                { $unwind: "$channel" },
                {
                    $lookup: {
                        from: "users",
                        localField: "subscriber",
                        foreignField: "_id",
                        as: "subscriber",
                        pipeline: [{
                            $project: {
                                username: 1,
                                fullName: 1,
                                _id: 0
                            }
                        }]
                    }
                },
                { $unwind: "$subscriber" },
                {
                    $group: {
                        _id: "$channel._id",
                        channel: { $first: "$channel" },
                        subscribers: { $push: "$subscriber" },
                        subsCount: { $sum: 1 },
                    }
                },
            ])
            res.status(200).json(new ApiResponse(200, subscribers[0] || { subscribers: [], subsCount: 0, channel: null }, "subscriber fetched successfully"))
        } catch (error) {
            next(error)
        }
    },
    // controller to return channel list to which user has subscribed
    async getSubscribedChannels(req, res, next) {
        // const { subscriberId } = req.params
        //✅ getSubscribedChannels
        // Finds all channels the logged-in user is subscribed to.
        // $lookup → gets channel details (username, fullName, avatar).
        // $unwind → ensures single object, not array.
        // $group → collects into { channels[], SubscribedChannelCount }.

        const userId = req.user._id
        try {
            const channelList = await Subscription.aggregate([
                {
                    $match: {
                        subscriber: new mongoose.Types.ObjectId(userId)
                    }
                }
                // ,
                // {
                //     $lookup: {
                //         from: "users",
                //         localField: "subscriber",
                //         foreignField: "_id",
                //         as: "subscriber",
                //         pipeline: [
                //             {
                //                 $project: {
                //                     username: 1,
                //                     fullName: 1
                //                 }
                //             }
                //         ]
                //     }
                // },
                // { $unwind: "$subscriber" }
                ,
                {
                    $lookup: {
                        from: "users",
                        localField: "channel",
                        foreignField: "_id",
                        as: "channel",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "subscriptions",
                                    localField: "_id",
                                    foreignField: "channel",
                                    as: "subscribers"
                                }
                            },
                            {
                                $addFields: {
                                    subscribers: { $size: "$subscribers" }
                                }
                            },
                            {
                                $project: {
                                    username: 1,
                                    fullName: 1,
                                    avatar: 1,
                                    subscribers: 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$channel" },
                {
                    $group: {
                        _id: null,
                        channels: { $push: "$channel" },
                        subscribedChannelCount: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        channels: 1,
                        subscribedChannelCount: 1
                    }
                }

            ])

            return res.status(200).json(new ApiResponse(200, channelList[0] || { channels: [], subscribedChannelCount: 0 }, "fetched channel list to which user has subscribed"))
        } catch (error) {
            next(error)
        }
    },

    async isSubscribedToChannel(req, res, next) {
        const { channelId } = req.params
        const userId = req.user?._id;
        if (!channelId) throw new ApiError(401, "Channel id is not provided")
        try {
            const subscription = await Subscription.findOne({ channel: channelId, subscriber: userId })
            return res.status(200).json(new ApiResponse(200, { isSubscribed: !!subscription }, "fetched subscription status"))
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}

export default subscriptionController