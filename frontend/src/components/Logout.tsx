import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

const Logout: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            console.log("Logging out");
            await logout();
            console.log("Has logged out:", useAuthStore.getState().hasLoggedOut);
            navigate('/login');
        };

        performLogout();
    }, [logout, navigate]);

    return <div>Logging out...</div>;
};

export default Logout;