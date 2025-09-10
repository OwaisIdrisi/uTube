import { User } from "../models/user.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import authController from "../controllers/auth.controller.js";

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1]
        if (!token) throw new ApiError(401, "Unathorized request")
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if (!user) throw new ApiError(401, "Invalid Access Token")
        req.user = user
        next()
    } catch (error) {
        console.log("JWT error:", error.name);

        if (error.name === "TokenExpiredError") {
            console.log(error);
            return res.status(401).json(new ApiError(401, "Access token expired", {
                expiredAt: error.expiredAt.toISOString(),
            }));
        }
        throw new ApiError(401, error.message || "Unathorized request")
    }
}
export { authenticateUser }