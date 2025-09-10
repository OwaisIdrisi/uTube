import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authSlice.js"
import videoSlice from "@/features/VideoSlice.js"


const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoSlice,
    }
})

export default store;