import type {AuthContextType} from "../types/auth.ts";
import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {setAuthToken, setUnauthorizedHandler} from "../api/client.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token")
    })

    const isAuthenticated = !!token;


    useEffect(() => {
        setAuthToken(token)

    }, [token]);

    useEffect(() => {
        setUnauthorizedHandler(logout)
    }, []);


    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);

    }


    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    const value: AuthContextType = {
        token,
        isAuthenticated,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}