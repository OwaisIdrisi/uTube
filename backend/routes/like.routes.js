import { Router } from 'express';
import likeController from "../controllers/like.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(authenticateUser); // Apply auth middleware to all routes in this file

router.route("/toggle/v/:videoId").post(likeController.toggleVideoLike);
router.route("/toggle/c/:commentId").post(likeController.toggleCommentLike);
router.route("/toggle/t/:tweetId").post(likeController.toggleTweetLike);
router.route("/videos").get(likeController.getLikedVideos);

router.route("/v/:videoId").get(likeController.getVideoLikes);
router.route("/c/:commentId").get(likeController.getCommentLikes);
router.route("/t/:tweetId").get(likeController.getTweetLikes);

export default router