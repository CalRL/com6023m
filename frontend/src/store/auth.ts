import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import axios from "../api/axios.ts";

/**
 * Represents a user object decoded from JWT.
 */
interface User {
    email: string;
}

/**
 * Represents the authentication state and methods for managing user authentication.
 */
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    initializeAuth: () => void;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
    hasLoggedOut: boolean;
}

/**
 * Zustand store for managing user authentication state.
 */
const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    hasLoggedOut: false,

    /**
     * Initializes authentication state by checking localStorage for an existing JWT token.
     */
    initializeAuth: async () => {
        const state = useAuthStore.getState();
        console.log(`Has logged out: ${state.hasLoggedOut}`)
        if (state.hasLoggedOut) {
            console.log('Auth check skipped due to recent logout.');
            return;
        }

        set({ loading: true });

        try {
            console.log('Initializing auth via /auth/check...');
            const res = await axios.get('/auth/check', {
                withCredentials: true,
            });

            const data = res.data;

            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            }

            set({
                user: { email: data.email },
                token: data.accessToken ?? null,
                isAuthenticated: true,
                loading: false,
            });

            console.log('Auth initialized: user is authenticated.');
        } catch (error) {
            console.error('Error initializing authentication:', error);
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
            });

            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    },

    /**
     * Logs in a user by storing the JWT token and updating the authentication state.
     */
    login: (token: string) => {
        try {
            const user = jwtDecode<User>(token);
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true });
            console.log('User logged in:', user.email);
        } catch (error) {
            console.error('Failed to decode token during login:', error);
        }
    },

    /**
     * Logs out the user by clearing the JWT token and authentication state.
     */
    logout: async () => {
        try {
            const response = await axios.post('/auth/logout', {}, { withCredentials: true });
            console.log(JSON.stringify(response));
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                hasLoggedOut: true,
            });

            console.log('User logged out successfully.');
        } catch (error) {
            console.error('Logout failed:', error);

        }
    }
}));

export default useAuthStore;
