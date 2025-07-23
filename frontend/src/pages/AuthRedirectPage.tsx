import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSmartNavigate } from '@/hooks/useSmartNavigate';

const AuthRedirectPage = () => {
    const { refreshUser } = useAuth();
    const { goPublic, goToDashboard } = useSmartNavigate();

    useEffect(() => {
        const resume = async () => {
            const user = await refreshUser();
            if (!user) {
                goPublic("/login");
            }
            else {
                goToDashboard(user);
            }
        }
        resume();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Redirecting…</p>
        </div>
    );
};

export default AuthRedirectPage;
