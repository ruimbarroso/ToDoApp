import { useState, createContext, useContext, type ReactNode, useCallback } from "react";
import { type User } from "../models/user";

export const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    me: () => Promise<void>;
    refresh: () => Promise<void>;
    remove: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    
    const me = useCallback(async () => {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        }
        );
        if (response.ok) {
            const data: User = await response.json();
            setUser(data);
        } else {
            throw new Error("User not login");
        }
    }, []);
    const login = useCallback(async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            await me();
        } else {
            throw new Error("User login failed");
        }
    }, [me]);
    const logout = useCallback(async () => {
        const response = await fetch(`${API_URL}/users/logout`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        }
        );
        if (response.ok) {
            setUser(null);
        } else {
            throw new Error("User logout failed");
        }
    }, []);

    const refresh = useCallback(async () => {
        const response = await fetch(`${API_URL}/users/refresh`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.ok) {
            await response.json();

            await me();
        } else {
            throw new Error("User not login");
        }
    }, [me]);
    const remove = useCallback(async () => {
        if (!user) { return; }
        const response = await fetch(`${API_URL}/users`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: user.id }),
        });
        if (response.ok) {
            await logout();
        } else {
            throw new Error("User not deleted");
        }
    }, [logout, user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, me, refresh, remove }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
