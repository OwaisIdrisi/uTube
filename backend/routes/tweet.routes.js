import { Router } from 'express';
import TweetController from "../controllers/tweet.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(authenticateUser); // Apply authenticateUser middleware to all routes in this file

router.route("/").post(TweetController.createTweet).get(TweetController.getAllTweets);
router.route("/user/:userId").get(TweetController.getUserTweets);
router.route("/:tweetId").get(TweetController.getTweetDetails)
    .patch(TweetController.updateTweet).delete(TweetController.deleteTweet);



export default router