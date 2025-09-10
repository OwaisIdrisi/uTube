import { Router } from 'express';
import subscriptionController from "../controllers/subscription.controller.js"

import { authenticateUser } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(authenticateUser); // Apply auth middleware to all routes in this file

router
    .route("/c/:channelId")
    .post(subscriptionController.toggleSubscription);
router.get("/u/subscribedChannels", subscriptionController.getSubscribedChannels);
router.route("/u/is-subscribed/:channelId").get(subscriptionController.isSubscribedToChannel);

router.route("/u/:channelId").get(subscriptionController.getUserChannelSubscribers);

export default router;