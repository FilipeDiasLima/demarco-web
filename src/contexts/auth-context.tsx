import type { UserProps } from "@/interface/user";
import { api } from "@/services/api";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextDataProps {
  user: UserProps;
  isAuthenticated: boolean;
  loading: boolean;
  getUser: () => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextDataProps);

const TOKEN_KEY = "@demarco.token";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as UserProps);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser({} as UserProps);
    setToken("");
  }, []);

  const signIn = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const response = await api.post("/auth", data);
        setUser(response.data.user);

        const token = response.data.access_token;
        localStorage.setItem(TOKEN_KEY, token);
        setToken(token);
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
      }
    },
    []
  );

  const getUser = useCallback(async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      signOut();
    }
  }, [signOut]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem(TOKEN_KEY);
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUser().finally(() => setLoading(false));
    }
  }, [token, getUser]);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut,
    });

    return () => {
      subscribe();
    };
  }, [signOut]);

  const isAuthenticated = !!token && Object.keys(user).length > 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signIn,
        getUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
