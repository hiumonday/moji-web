import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1", // Base URL for the API
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor to attach tokens if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
