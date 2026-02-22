import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar: string;
  org_id: string | null;
  approved: boolean;
}

interface Organization {
  id: string;
  name: string;
  logo: string | null;
  plan: string;
  invite_code: string;
}

type AppRole = "admin" | "manager" | "member";

interface AuthState {
  user: SupabaseUser | null;
  profile: Profile | null;
  organization: Organization | null;
  role: AppRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, email: string, password: string, orgName: string, role: AppRole) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    organization: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const fetchProfileData = useCallback(async (userId: string) => {
    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!profile) return { profile: null, organization: null, role: null };

    // Fetch organization
    let organization: Organization | null = null;
    if (profile.org_id) {
      const { data: org } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profile.org_id)
        .single();
      organization = org;
    }

    // Fetch role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    return {
      profile: profile as Profile,
      organization,
      role: (roleData?.role as AppRole) || null,
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    const userId = state.user?.id;
    const sessionUserId = userId || (await supabase.auth.getSession()).data.session?.user?.id;
    if (!sessionUserId) return;
    const data = await fetchProfileData(sessionUserId);
    setState((s) => ({ ...s, ...data, user: s.user }));
  }, [state.user, fetchProfileData]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            const data = await fetchProfileData(session.user.id);
            setState({
              user: session.user,
              ...data,
              isAuthenticated: true,
              isLoading: false,
            });
          }, 0);
        } else {
          setState({
            user: null,
            profile: null,
            organization: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfileData(session.user.id).then((data) => {
          setState({
            user: session.user,
            ...data,
            isAuthenticated: true,
            isLoading: false,
          });
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileData]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, orgName: string, role: AppRole) => {
    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) return { error: authError.message };
    if (!authData.user) return { error: "Signup failed" };

    const userId = authData.user.id;

    // 2. Generate org ID client-side to avoid SELECT-after-INSERT RLS issue
    const orgId = crypto.randomUUID();

    // 3. Create organization (without .select() to avoid RLS SELECT check)
    const { error: orgError } = await supabase
      .from("organizations")
      .insert({ id: orgId, name: orgName });
    if (orgError) return { error: orgError.message };

    // 4. Create profile (links user to org)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ user_id: userId, name, email, org_id: orgId });
    if (profileError) return { error: profileError.message };

    // 5. Assign role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });
    if (roleError) return { error: roleError.message };

    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
