import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "user" | "instrutor";
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: UserRole[];
  isAdmin: boolean;
  isInstructor: boolean;
  isActive: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = roles.some((r) => r.role === "admin");
  const isInstructor = roles.some((r) => r.role === "instrutor");
  const isActive = true; // Sempre ativo - não precisa de aprovação

  // Debug removed for production

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId as any)
        .single();

      if (profileError) {
        console.error("Erro ao buscar profile:", profileError);
      }

      if (profileData) {
        setProfile(profileData as unknown as Profile);
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId as any);

      if (rolesError) {
        console.error("Erro ao buscar roles:", rolesError);
      }

      if (rolesData && rolesData.length > 0) {
        setRoles(rolesData as unknown as UserRole[]);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up listener FIRST (required by Supabase SDK)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock on initial load
          setTimeout(async () => {
            await fetchProfile(session.user.id);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
    setProfile(null);
    setRoles([]);
    setUser(null);
    setSession(null);
    // Clear all app-related localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cnhpro_") || key.startsWith("sb-")) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        isAdmin,
        isInstructor,
        isActive,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}