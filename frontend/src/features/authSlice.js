import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserAndToken(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        SetError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        logoutState(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
})

export const { setUserAndToken, setLoading, SetError, logoutState } = authSlice.actions;
export default authSlice.reducer;