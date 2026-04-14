import { createContext, useEffect, useMemo, useState } from "react";
import { getMeApi, loginApi, logoutApi } from "./auth.api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const data = await getMeApi();

            const normalizedUser = data?.user
                ? {
                    _id: data.user._id,
                    code: data.user.code,
                    fullName: data.user.fullName || data.user.name || "",
                    role: data.user.role,
                    email: data.user.email || "",
                    avatarUrl: data.user.avatarUrl || "",
                }
                : null;

            setUser(normalizedUser);
            return normalizedUser;
        } catch (error) {
            setUser(null);
            return null;
        }
    };

    useEffect(() => {
        const bootstrap = async () => {
            await fetchCurrentUser();
            setIsInitializing(false);
        };

        bootstrap();
    }, []);

    const login = async ({ username, password }) => {
        await loginApi({ username, password });
        return await fetchCurrentUser();
    };

    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            setUser(null);
        }
    };

    const value = useMemo(
        () => ({
            user,
            setUser,
            login,
            logout,
            fetchCurrentUser,
            isAuthenticated: !!user,
            isInitializing,
        }),
        [user, isInitializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}