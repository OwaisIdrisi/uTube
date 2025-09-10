import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
    loading: false,
    error: null
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideos(state, action) {
            state.videos = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
})

export const { setVideos, setError, setLoading } = videoSlice.actions;

export default videoSlice.reducer;
