import { ApiError } from "../utils/ApiError.js"
import authController from "../controllers/auth.controller.js";
const errorHandler = (err, req, res, next) => {
    let error = err
    console.log("eeerrrorrr", error);

    //  if it is not an ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || "Internal server error"
        error = new ApiError(statusCode, message)
    }
    res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // show stack only in dev
        details: error.details || undefined, // allow passing extra info like "token expired"
    })
}

export { errorHandler }