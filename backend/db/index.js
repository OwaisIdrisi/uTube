import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connection = mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to MongoDB");
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1)

    }
}

export default connectToDB