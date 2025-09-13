import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { destroyImage, getPublicIdFromUrl, uploadOnCloudinary } from "../utils/cloudinary.js"



const videoController = {
    async getAllVideos(req, res, next) {
        const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query
        //TODO: get all videos based on query, sort, pagination
        const skip_document = Number(limit * (page - 1))
        const filter = {}
        if (query) {
            filter.$or = [{
                title: { $regex: query, $options: 'i' },
                description: { $regex: query, $options: 'i' },
            }]
        }
        if (userId) {
            filter.owner = userId
        }
        const sortOrder = sortType === 'asc' ? 1 : -1
        const sort = { [sortBy]: sortOrder } // videos.sort({"createdAt" : 'asc'})
        try {
            // const videos = await Video.find(filter)
            const videos = await Video.aggregate([
                { $match: filter },
                { $sort: sort },
                { $skip: skip_document },
                { $limit: Number(limit) },
                {
                    // Format date fields example : 1 days ago , 3 months ago, 5 minutes ago

                    $addFields: {
                        createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    }
                },
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
                { $unwind: "$owner" }
            ])

            const totalCount = await Video.countDocuments(filter)
            const totalPage = Math.ceil(totalCount / limit)


            return res.status(200).json(new ApiResponse(200, {
                videos, pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalCount,
                    totalPage

                }
            }))
        } catch (error) {
            next(error)
        }
    },
    async publishAVideo(req, res, next) {
        const { title, description } = req.body

        if ((title.trim() || description.trim()) == "") {
            throw new ApiError(400, "title/description required")
        }
        // TODO: get video, upload to cloudinary, create video
        try {
            if (!req.files) throw new ApiError(400, "videos and thumbnail are required")
            const videoFilePath = req.files?.videoFile[0]?.path
            const thumbnailPath = req.files?.thumbnail[0]?.path

            if (!videoFilePath || !thumbnailPath) {
                throw new ApiError(400, "video/thumbnail path is not given")
            }

            // upload video and thumbnail on cloudinary
            const videoFile = await uploadOnCloudinary(videoFilePath)
            const thumbnail = await uploadOnCloudinary(thumbnailPath)

            let video = new Video({
                videoFile: videoFile.url, thumbnail: thumbnail.url, owner: req.user._id, title, description, isPublished: true, duration: videoFile.duration
            })
            await video.save()
            return res.status(201).json(new ApiResponse(201, video, "video upload successful"))
        } catch (error) {
            next(error)
        }
    },

    async getVideoById(req, res, next) {
        const { videoId } = req.params
        const userId = new mongoose.Types.ObjectId(req.user?._id);
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid videoId")
        }
        //TODO: get video by id
        try {
            // const video = await Video.findById(videoId)
            const video = await Video.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(videoId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
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
                                    subscribersCount: { $size: "$subscribers" },
                                    isSubscribed: {
                                        $cond: {
                                            if: { $in: [userId, "$subscribers.subscriber"] },
                                            then: true,
                                            else: false
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    avatar: 1,
                                    username: 1,
                                    subscribersCount: 1,
                                    isSubscribed: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$owner" }
            ])
            if (!video) throw new ApiError(404, "Video not found")

            res.status(200).json(new ApiResponse(200, video[0] || {}, "video fetched successfully"))
        } catch (error) {
            next(error)
        }
    },

    async updateVideo(req, res, next) {
        //TODO: update video details like title, description, thumbnail
        const { videoId } = req.params
        if (!req.body) {
            throw new ApiError(400, "Request body is empty")
        }
        const { title, description } = req.body
        if ((title.trim() === "" || description.trim() === "")) {
            throw new ApiError(400, "title/description cannot be empty")
        }
        try {
            let video = await Video.findById(videoId)
            if (req.file && req.file?.path) {
                console.log(req.file);
                const thumbnail = await uploadOnCloudinary(req.file?.path)
                console.log(thumbnail);
                const publicId = getPublicIdFromUrl(video.thumbnail)
                video.thumbnail = thumbnail.url
                const resp = await destroyImage(publicId)
                console.log("deleted old thumbnail", resp);

            }
            video.title = title
            video.description = description;
            video.save({
                new: true
            })
            return res.status(200).json(new ApiResponse(200, { video }, "video details updated successfully"))
        } catch (error) {
            console.log(error);
            next(error)
        }

    },

    async deleteVideo(req, res, next) {
        const { videoId } = req.params
        //TODO: delete video
        try {
            const video = await Video.findByIdAndDelete(videoId)
            console.log(video);

            const videoFilePublicId = getPublicIdFromUrl(video.videoFile)
            const thumbnailPublicId = getPublicIdFromUrl(video.thumbnail)
            await destroyImage(videoFilePublicId, "video")
            await destroyImage(thumbnailPublicId)
            return res.status(200).json(new ApiResponse(200, {}, "video deleted successfully"))
        } catch (error) {
            next(error)
        }
    },

    async togglePublishStatus(req, res) {
        const { videoId } = req.params
        try {
            const video = await Video.findById(videoId)
            video.isPublished = !isPublished
            video.save()
            return res.status(200).json(new ApiResponse(200, { isPublished: video.isPublished }, video.isPublished ? "video isPublished" : "video unPublished"))
        } catch (error) {
            next(error)
        }
    },

    async getChannelVideos(req, res, next) {
        const { owner } = req.params
        try {
            const videos = await Video.find({ owner })
            res.status(200).json(new ApiResponse(200, videos, "channel videos fetched successfully"))
        } catch (error) {
            next(error)
        }
    },

    async incrementViewCount(req, res, next) {
        let { videoId } = req.params;
        videoId = new mongoose.Types.ObjectId(`${videoId}`)
        console.log("videoId", videoId, typeof videoId);

        // if (!isValidObjectId(videoId)) throw new ApiError(401, "invalid videoId")
        const userId = req.user?._id
        const COOL_DOWN_PERIOD = 1000 * 60 * 30; // 30 minutes
        try {
            const video = await Video.findOne({ _id: videoId })
            if (!video) {
                return res.status(404).json(new ApiResponse(404, {}, "Video not found"));
            }

            const existing = video?.viewedBy?.find(v => v.userId.toString() === userId.toString())

            if (existing) {
                //  diff is for example if user viewed video at 6:40 and after 5 min watching the same video then 6:45 - 6:40 = 5 min which is within 30 min i.e cooldowntime then views should not be increase until 30min
                const difference = (new Date().getTime() - existing.lastViewedAt.getTime())
                if (difference >= COOL_DOWN_PERIOD) {
                    //  Enough time passed → count a new view
                    video.views += 1
                    existing.lastViewedAt = new Date()
                    console.log("views increased after cooldown");
                }
            } else {
                console.log("first time view");
                video.views += 1;
                video.viewedBy.push({
                    userId, lastViewedAt: new Date()
                })
            }
            await video.save()
            return res.status(200).json(new ApiResponse(200, video, "views updated "))
        } catch (error) {
            next(error)
        }
    }

}

export default videoController