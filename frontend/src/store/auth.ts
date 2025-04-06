import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

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
}

/**
 * Zustand store for managing user authentication state.
 */
const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    /**
     * Initializes authentication state by checking localStorage for an existing JWT token.
     */
    initializeAuth: () => {
        console.log('Initializing authentication...');
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const user = jwtDecode<User>(token);
                console.log('Decoded user from token:', user);
                set({ user, token, isAuthenticated: true });
                console.log('Authentication initialized with token.');
            } else {
                console.warn('No token found in localStorage.');
            }
        } catch (error) {
            console.error('Error initializing authentication:', error);
            set({ user: null, token: null, isAuthenticated: false });
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
    logout: () => {
        try {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
            console.log('User logged out.');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    },
}));

export default useAuthStore;
