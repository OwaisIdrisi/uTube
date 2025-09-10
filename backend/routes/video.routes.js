import { Router } from 'express';
import videoController from "../controllers/video.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();
router.use(authenticateUser); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(videoController.getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        videoController.publishAVideo
    );

router
    .route("/:videoId")
    .get(videoController.getVideoById)
    .delete(videoController.deleteVideo)
    .patch(upload.single("thumbnail"), videoController.updateVideo);

router.route("/toggle/publish/:videoId").patch(videoController.togglePublishStatus);
router.route("/channel/:owner").get(videoController.getChannelVideos);
router.route("/addView/:videoId").post(videoController.incrementViewCount)

export default router