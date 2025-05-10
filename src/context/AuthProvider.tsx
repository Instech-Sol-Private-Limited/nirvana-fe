"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';

import {
    getSession,
    getUser,
    getProfile,
    onAuthStateChange
} from '../utils/auth';

type AuthData = {
    userId: any;
    accessToken: string | null;
    role: string | null;
};

type AuthContextType = AuthData & {
    loading: boolean;
    setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
};

const AuthContext = createContext<AuthContextType>({
    userId: null,
    accessToken: null,
    role: null,
    loading: true,
    setAuthData: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authData, setAuthData] = useState<AuthData>({
        userId: null,
        accessToken: null,
        role: null
    });
    console.log(authData)
    const [loading, setLoading] = useState<boolean>(true);

    const updateAuthData = (partial: Partial<AuthData>) => {
        setAuthData((prev) => ({ ...prev, ...partial }));
    };

    const fetchSessionData = async () => {
        setLoading(true);
        try {
            const sessionRes = await getSession();
            if (!sessionRes.success || !sessionRes.data) {
                setAuthData({ userId: null, accessToken: null, role: null });
                return;
            }

            const session = sessionRes.data;
           

            const userRes = await getUser();
            //@ts-ignore
            const currentUser = userRes.data?.user;

            if (!currentUser) {
                setAuthData({ userId: null, accessToken: null, role: null });
                return;
            }

            const profile = await getProfile(currentUser.id);
            console.log({
                userId: currentUser.id,
                accessToken: session.access_token,
                role: profile?.role || 'user'
            })
            setAuthData({
                userId: currentUser.id,
                accessToken: session.access_token,
                role: profile?.role || 'user'
            });
            if (session.access_token) {
                localStorage.setItem('accessToken', session.access_token);
            }
        } catch (error) {
            console.error('Auth error:', error);
            setAuthData({ userId: null, accessToken: null, role: null });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionData();

        const { data: subscriptionData } = onAuthStateChange(async (_event, session) => {
            if (session) {
                const profile = await getProfile(session.user.id);
                updateAuthData({
                    userId: session.user.id,
                    accessToken: session.access_token || null,
                    role: profile?.role || 'user'
                });
            } else {
                setAuthData({ userId: null, accessToken: null, role: null });
            }
        });

        // Safe unsubscribe
        return () => {
            subscriptionData?.subscription?.unsubscribe?.();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ ...authData, loading, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);