import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

interface UserProps {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextProps {
    user: UserProps | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProps | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    api.interceptors.request.use((config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        config.withCredentials = true;

        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response.status === 401 && refreshToken) {
                try {
                    const match = document.cookie.match(/(^|;)\\s*refresh_token=([^;]+)/);
                    const refresh_token = match ? match[2] : null;

                    if (!refresh_token) {
                        console.error("Refresh token not found in cookies");
                        throw new Error("Refresh token not found in cookies");
                    }

                    const { data } = await api.post("/auth/refresh", {}, {
                        withCredentials: true,
                    });

                    const { accessToken: newAcessToken } = data;
                    setAccessToken(newAcessToken);

                    localStorage.setItem("access_token", newAcessToken);

                    error.config.headers.Authorization = `Bearer ${newAcessToken}`;

                    return api.request(error.config);
                } catch (refreshError) {
                    console.error("Failed to refresh token: ", refreshError);
                    logout();
                }
            }

            return Promise.reject(error);
        }
    );


    useEffect(() => {
        setLoading(true);
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            fetchUserProfile(storedAccessToken);
        } else {
            setLoading(false);
        }
    });

    const fetchUserProfile = async (token: string) => {
        try {
            const { data } = await api.get("/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user profile: ", error);
            logout();
        } finally {
            setLoading(false);
        }
    }

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { data } = await api.post("/auth/login", { email, password }, { withCredentials: true });

            const { accessToken, refreshToken } = data;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            document.cookie = `refresh_token=${refreshToken}; path=/; secure; samesite=strict`;

            await fetchUserProfile(accessToken);

            setLoading(false);
            toast({
                title: "Login",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">Logged in successfully</code>
                    </pre>
                ),
                duration: 5000,
            })
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Login Failed",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                            <code className="text-white">{error.response?.data || error.message}</code>
                        </pre>
                    ),
                    duration: 5000,
                })
                console.error("Login Failed: ", error.response?.data || error.message);
            } else {
                toast({
                    title: "Login Failed",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                            <code className="text-white">{(error as Error).message || "Unknown error occurred"}</code>
                        </pre>
                    ),
                    duration: 5000,
                })
                console.log("Login Failed: ", (error as Error).message || "Unknown error occurred");
            }
        }
    }

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}