import connectToDB from "./db/index.js"
import { app } from "./app.js"
import { errorHandler } from "./middlewares/error.middleware.js"

const port = process.env.PORT || 8000

connectToDB()


app.use(errorHandler)
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
})

