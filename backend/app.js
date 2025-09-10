import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import videoRoute from "./routes/video.routes.js"
import subscriptionRoute from "./routes/subscription.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import { configDotenv } from "dotenv"

configDotenv({
    path: "./.env"
})

export const app = express()

// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials: true,
// }))

app.use(cors({
    origin: [
        process.env.CORS_ORIGIN,
        "http://192.168.1.12:5173"
    ],
    credentials: true,
}))



app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() })
})
app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos', videoRoute)
app.use('/api/v1/subscriptions', subscriptionRoute)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/tweets", tweetRouter)
