import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type UserRole = "elvira" | "hotel" | "guest" | "restaurant" | "agency";

interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw new Error(authError.message);

      // 2. Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, email")
        .eq("id", authData.user?.id)
        .single();

      if (profileError) throw new Error(profileError.message);

      // 3. Check if user has hotel role
      if (profile.role !== "hotel") {
        throw new Error("Access denied. Only hotel staff can login here.");
      }

      setUser(profile);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook moved to hooks/auth/useAuth.ts
