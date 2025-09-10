
import axios from "axios"
import { createApiClient } from "./apiClient"

const api = createApiClient(`${import.meta.env.VITE_BASE_URL}/users`)


export const register = async (data) => {
    const response = await api.post('/register', data)
    return response.data
}

export const login = async (data) => {
    const response = await api.post('/login', data)
    console.log(response);
    return response.data
}

export const logout = async () => {
    const response = await api.post('/logout')
    console.log(response);
    return response.data
}

export const getCurrentUser = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/me`, {
        withCredentials: true
    })
    return response.data
}

export const refreshAccessToken = async () => {
    const response = await api.post('/refresh-token')
    console.log(response);
    return response.data
}

export const verifyEmail = async () => {
    const response = await api.post('/me')
    console.log(response);
    return response.data
}
