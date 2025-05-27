import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
/**
 * Creates an Axios instance for making HTTP requests to the backend API.
 *
 * - Uses a base URL specified by environment variables.
 * - Sets default headers for JSON data.
 *
 * @constant {AxiosInstance} axiosInstance - Configured Axios instance.
 */
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Axios request interceptor to attach the JWT token to every outgoing request.
 *
 * - Retrieves the token from localStorage.
 * - If a token exists, it is added to the `Authorization` header as a Bearer token.
 * - Allows all requests to automatically include authentication headers when the user is logged in.
 *
 * @returns {AxiosRequestConfig} - The modified request configuration.
 */
axiosInstance.interceptors.request.use((config) => {
    try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error attaching token to request:', error);
    }
    return config;
});

export default axiosInstance;