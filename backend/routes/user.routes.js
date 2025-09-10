import express from "express"
import auth from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import userController from "../controllers/user.controller.js"
const router = express.Router()

router.post("/register", upload.fields([{
    name: 'avatar',
    maxCount: 1
}, {
    name: "coverImage",
    maxCount: 1
}]), auth.register)

router.post("/login", auth.login)
router.post("/logout", authenticateUser, auth.logout)
router.get("/me", authenticateUser, auth.me)
router.post("/refresh-token", auth.refreshAccessToken)
router.post("/verify-email", authenticateUser, auth.verification)

router.get("/channel/:username", authenticateUser, userController.getUserChannelProfile)
router.post("/subscribe-channel", authenticateUser, userController.subscribeChannel)
export default router