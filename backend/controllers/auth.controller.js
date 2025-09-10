import { User } from "../models/user.js";
import { verifyEmail } from "../services/email/verifyMail.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs"

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",           // must be true in production HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
}

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction ? true : false,        // only true on HTTPS
        sameSite: isProduction ? "None" : "Lax",   // force None even in dev for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
}


const generateToken_and_save = async (userId) => {
    const user = await User.findById(userId)
    if (!user) throw new ApiError(404, "User not found")

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}

const auth = {
    async register(req, res, next) {
        // validate req 
        // check if user already exists
        // upload avatar and cover image
        // save user to db
        //  genereate tokens
        // response
        const { username, email, fullName, password } = req.body

        if (!username?.trim() || !email?.trim() || !fullName?.trim() || !password?.trim()) {
            throw new ApiError(400, "All fields are required")
        }

        if (!(username && email)) {
            return res.status(400).json(new ApiError(400, "Username/email is required"))
        }
        if (!password) res.status(400).json(new ApiError(400, "password is required"))
        if (!fullName) res.status(400).json(new ApiError(400, "Full name is required is required"))

        // TODO: make error more structure and detailed
        // With validation errors
        // throw new ApiError(400, "Validation failed", '', [
        //     { field: 'email', message: 'Invalid email format' },
        //     { field: 'password', message: 'Password too short' }
        // ])
        try {
            const userExist = await User.findOne({ $or: [{ username }, { email }] })
            if (userExist) {
                if (req.files) {
                    const avatarPath = req.files?.avatar[0].path
                    const coverPath = req.files?.coverImage && req.files?.coverImage[0]?.path
                    fs.unlinkSync(avatarPath)
                    coverPath && fs.unlinkSync(coverPath)
                }
                throw new ApiError(400, "User is already exists")
            }
            console.log(req.files);

            const avatarLocalPath = req.files?.avatar[0]?.path
            let coverImageLocalPath = req.files?.coverImage && req.files?.coverImage[0]?.path

            if (!avatarLocalPath) {
                throw new ApiError(400, "Avatar is required ")
            }
            const avatar = await uploadOnCloudinary(avatarLocalPath)
            let coverImage;
            if (coverImageLocalPath) {
                coverImage = await uploadOnCloudinary(coverImageLocalPath)
            }

            let user = new User({
                username: username.toLowerCase(), email, fullName, password, avatar: avatar.url, coverImage: coverImage ? coverImage.url : ""
            })
            user = await user.save()
            console.log(user);

            const { accessToken, refreshToken } = await generateToken_and_save(user._id)
            console.log("register");
            // await verifyEmail(accessToken, user.email)
            // return res.status(201)
            //     .cookie("accessToken", accessToken, options)
            //     .cookie("refreshToken", refreshToken, options)
            //     .json(new ApiResponse(201, {
            //         user: {
            //             _id: user._id,
            //             username: user.username,
            //             email: user.email,
            //             fullName: user.fullName,
            //             avatar: user.avatar,
            //             coverImage: user.coverImage
            //         },
            //         accessToken
            //     }, "Register successful"));
            return res.status(201)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(new ApiResponse(201, {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        avatar: user.avatar,
                        coverImage: user.coverImage
                    },
                    accessToken
                }, "Register successful"));
        } catch (error) {
            console.log("error", error);
            next(error)
        }
    },

    async login(req, res, next) {
        // req body -> data
        // username or email
        //find the user
        //password check
        //access and referesh token
        //send cookie  
        const { username, email, password } = req.body
        if (!(username || email)) throw new ApiError(400, "Username/email is required")
        if (!password) throw new ApiError(400, "password is required")

        try {
            const user = await User.findOne({ $or: [{ username }, { email }] }).select("-refreshToken")
            if (!user) throw new ApiError(404, "User does not exists")

            const isPasswordValid = await user.isPasswordCorrect(password)
            if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials")

            if (user.isVerified !== true) {
                throw new ApiError(403, "Verify your email then login")
            }

            const { accessToken, refreshToken } = await generateToken_and_save(user._id)


            console.log("login");
            // res.status(200)
            //     .cookie("accessToken", accessToken, options)
            //     .cookie("refreshToken", refreshToken, options)
            //     .json(new ApiResponse(200, { user, accessToken }))
            res.status(200)
                .cookie("accessToken", accessToken, getCookieOptions())
                .cookie("refreshToken", refreshToken, getCookieOptions())
                .json(new ApiResponse(200, { user, accessToken }))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    async logout(req, res, next) {
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $unset: {
                    refreshToken: 1
                }
            }, {
                new: true
            })
            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",           // must be true in production HTTPS
            }

            // res.
            //     status(200)
            //     .clearCookie("accessToken", options)
            //     .clearCookie("refreshToken", options)
            //     .json(new ApiResponse(200, {}, "User Logged Out"))
            res.
                status(200)
                .clearCookie("accessToken", getCookieOptions())
                .clearCookie("refreshToken", getCookieOptions())
                .json(new ApiResponse(200, {}, "User Logged Out"))

        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    async me(req, res) {
        try {
            const user = await User.findById(req.user._id).select("-password -refreshToken")
            if (!user) throw new ApiError(404, "User Not Found")
            return res.status(200).json(new ApiResponse(200, { user }))
        } catch (error) {
            next(error)
        }
    },
    async refreshAccessToken(req, res, next) {
        console.log("abc");
        const ClearOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
        console.log("Incoming refresh token:", incomingRefreshToken);
        if (!incomingRefreshToken) throw new ApiError(401, "Unathorized Request")
        try {
            const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
            console.log(decodedToken);
            const user = await User.findById(decodedToken._id)
            console.log(user);

            if (!user) throw new ApiError(401, "Invalid Refresh Token")

            if (incomingRefreshToken !== user.refreshToken) {
                return res.status(401).clearCookie("accessToken", ClearOptions).clearCookie("refreshToken", ClearOptions).json(new ApiError(401, "Refresh token is expired or used"))
            }
            const { accessToken, refreshToken } = await generateToken_and_save(user._id)
            // return res.status(200).cookie("accessToken", accessToken, options)
            //     .cookie("refreshToken", refreshToken, options)
            //     .json(new ApiResponse(200, { accessToken }, "Access token Refreshed"))
            return res.status(200).cookie("accessToken", accessToken, getCookieOptions())
                .cookie("refreshToken", refreshToken, getCookieOptions())
                .json(new ApiResponse(200, { accessToken }, "Access token Refreshed"))
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    async verification(req, res) {
        const accessToken = req.cookies?.accessToken || req.headers("Authorization").split(" ")[1]
        if (!accessToken) throw new ApiError(401, "Unathorized Request")
        try {
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decodedToken._id)
            if (!user) throw new ApiError(404, "User not found")
            user.isVerified = true
            await user.save()
            return res.status(200).json(new ApiResponse(200, {}, "Email Verified successfully"))
        } catch (error) {
            console.log(error.name);
            if (error.name === "TokenExpiredError") {
                throw new ApiError(400, "Token has expired")
            }
            next(error)
        }
    }
    ,
    async changeCurrentPassword(req, res) {
        const { oldPassword, newPassword } = req.body

        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
        if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password")
        user.password = newPassword
        await user.save({ validateBeforeSave: false })
        return res.status(200).json(new ApiResponse(200, {}, "password changed successfully"))
    }

}

export default auth