import supabase from '@/config/supabse';

type UserRole = 'superadmin' | 'user' | 'guest';

interface UserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}



const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        if (!data?.user || !data?.session) {
            return {
                success: false,
                message: 'Authentication succeeded but session or user data is missing.',
            };
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            return {
                success: false,
                message: 'User authenticated, but profile could not be fetched.',
            };
        }

        return {
            success: true,
            data: {
                session: data.session,
                profile,
            },
        };
    } catch (err: any) {
        return { success: false, message: err.message || "Unexpected error during sign in" };
    }
};

// Oauth signin
const signInWithGoogle = async () => {
    try {
        const redirectTo = `${window.location.origin}/membership`;
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
    } catch (err: any) {
        return { error: err.message || "Unexpected error during Google Sign In" };
    }
};

// sign out
const signOut = async () => {
    try {
        return await supabase.auth.signOut();
    } catch (err: any) {
        return { error: err.message || "Unexpected error during sign out" };
    }
};

// get profile
const getProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (err: any) {
        console.error("Error fetching profile:", err.message);
        return null;
    }
};

// get session
const getSession = async () => {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error || !session) {
            return { success: false, message: "No session found!" };
        }

        return { success: true, data: session };
    } catch (err: any) {
        return { success: false, message: err.message || "Unexpected error getting session" };
    }
};

// get user
const getUser = async () => {
    try {
        return await supabase.auth.getUser();
    } catch (err: any) {
        return { error: err.message || "Unexpected error getting user" };
    }
};

// auth state change
const onAuthStateChange = (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => {
    return supabase.auth.onAuthStateChange(callback);
};

export {
    signIn,
    signInWithGoogle,
    signOut,
    getProfile,
    getUser,
    getSession,
    onAuthStateChange,
};
