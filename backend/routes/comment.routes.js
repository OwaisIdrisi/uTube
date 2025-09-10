import { Router } from 'express';
import commentController from "../controllers/comment.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(authenticateUser); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(commentController.getVideoComments).post(commentController.addComment);
router.route("/c/:commentId").delete(commentController.deleteComment).patch(commentController.updateComment);

// tweet comments routes
router.route("/t/:tweetId").post(commentController.addTweetComment).get(commentController.getTweetComments);

export default router