
class ApiError extends Error {
    constructor(statusCode, message = "something went wrong", stack = '', errors = []) {
        super(message)
        this.success = false
        this.statusCode = statusCode
        this.message = message
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
    toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors
        }
    }
}


export { ApiError }