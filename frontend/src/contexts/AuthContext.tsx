import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/services/api";

type AppRole = "admin" | "manager" | "member";

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orgId: string | null;
  approved: boolean;
}

interface Organization {
  id: string;
  name: string;
  logo?: string | null;
  plan: string;
  inviteCode: string;
}

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  organization: Organization | null;
  role: AppRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (
    name: string,
    email: string,
    password: string,
    orgName: string,
    role: AppRole
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    organization: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 🔹 Fetch authenticated user info
  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      const { user, profile, organization, role } = res.data;

      setState({
        user,
        profile,
        organization,
        role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      setState({
        user: null,
        profile: null,
        organization: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // 🔹 Initial session check (cookie-based)
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // 🔹 Login
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await api.post("/auth/login", { email, password });
        await fetchMe();
        return { error: null };
      } catch (err: any) {
        return {
          error:
            err.response?.data?.message || "Login failed. Please try again.",
        };
      }
    },
    [fetchMe]
  );

  // 🔹 Signup
  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      orgName: string,
      role: AppRole
    ) => {
      try {
        await api.post("/auth/signup", {
          name,
          email,
          password,
          orgName,
          role,
        });

        await fetchMe();
        return { error: null };
      } catch (err: any) {
        return {
          error:
            err.response?.data?.message ||
            "Signup failed. Please try again.",
        };
      }
    },
    [fetchMe]
  );

  // 🔹 Logout
  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setState({
      user: null,
      profile: null,
      organization: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // 🔹 Manual refresh
  const refreshProfile = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};