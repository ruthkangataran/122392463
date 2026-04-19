// https://docs.expo.dev/versions/latest/sdk/securestore/
// https://youtu.be/9vydY9SDtAo?si=ogTkZMiXQxhR_ty-
import React, {createContext, useContext, useState} from 'react';
import { users } from '@/db/schema';
import { db } from '@/db/client';
import { eq} from 'drizzle-orm';

interface User {
  id: number;
  email: string;
  name: string;
}

// This describes what's stored in our auth state (token, user info, memberships, etc.)
interface AuthState {
  authenticated: boolean;
  user: User | null;
}
// https://www.pluralsight.com/resources/blog/guides/use-interface-props-in-functional-components-using-typescript-with-react
// This describes what our Context will expose to the rest of the app (functions + state).
interface AuthProps {
    authState: AuthState;
    onLogin: (email: string, password: string) => Promise<{ error?: boolean; msg?: string }>;
    onRegister: (name: string, email: string, password: string) => Promise<{ error?: boolean; msg?: string }>;
    onLogout: () => void;
    onDeleteAccount: () => Promise<void>;

}


const AuthContext = createContext<AuthProps>({
    authState: {authenticated: false,  user: null},
    onLogin: async () => ({}),
    onRegister: async () => ({}),
    onLogout: () => {},
    onDeleteAccount: async () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

// feeds auth values to everywhere
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [authState, setAuthState] = useState<AuthState>({ authenticated: false, user: null});

// https://dev.to/apilover/applicationx-www-form-urlencoded-vs-applicationjson-which-one-to-use-i0a
    const onLogin = async (email: string, password: string) => {
        try {
            const res = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
            if (res.length === 0) {
                return {error: true, msg: 'No account found'};
            }
             const user = res[0];

            if (user.password !== password) {
                return { error: true, msg: 'Incorrect password.'};
            }
            setAuthState({
                user: {id :user.id, name: user.name, email: user.email },
                authenticated: true,
            });
            return {};
        } catch (e) {
            return {error: true, msg: "login failed. please try again"};
        }
    };

    const onRegister = async (name: string, email: string, password: string)=> {
        try {
            const existing = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
            if (existing.length > 0) {
                return { error: true, msg: 'account with that email already exists'};
            }
            await db.insert(users).values({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });
            const res = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
            if (res. length > 0) {
                const user = res[0];
                setAuthState({
                user: {id :user.id, name: user.name, email: user.email },
                authenticated: true,
            });
            }
            return {};
        } catch (e) {
            return {error: true, msg: "Registration failed. please try again"};
        }
    };

    const onLogout = () => {
        setAuthState({
                user: null,
                authenticated: false,
            })
    };

    const onDeleteAccount = async () => {
        if (!authState.user) return;

        try{
            await db.delete(users).where(eq(users.id, authState.user.id));
            setAuthState({user: null, authenticated: false});
        } catch (e) {
            console.error('Failed to delete:', e);
        }
    };
    // The object we provide to the rest of the app via Context
    const value = {
        onLogin,
        onLogout,
        onRegister,
        authState,
        onDeleteAccount,
    };
    // Wrap children so any component inside can access auth using useAuth()
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};