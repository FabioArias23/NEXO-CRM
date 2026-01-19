import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import type { User, UserRole } from "../core/types";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      console.log("🔄 AuthContext: Cargando sesión...");
      try {
        const user = await authService.getCurrentUser();
        console.log("👤 Usuario de sesión:", user);
        setUser(user);

        if (user) {
          const session = await authService.getSession();
          console.log("🎫 Sesión obtenida:", session ? "Sí" : "No");
          if (session?.access_token) {
            setAccessToken(session.access_token);
          }
        }
      } catch (err) {
        console.error("❌ Error loading session:", err);
      } finally {
        console.log("✅ AuthContext: Sesión cargada, loading = false");
        setLoading(false);
      }
    };

    loadSession();
    const unsubscribe = authService.onAuthChange(async (user) => {
      console.log("🔔 AuthContext: Cambio de auth detectado", user);
      setUser(user);
      if (!user) {
        setAccessToken(null);
      } else {
        try {
          const session = await authService.getSession();
          if (session?.access_token) {
            setAccessToken(session.access_token);
          }
        } catch (err) {
          console.error("Error updating token:", err);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔑 AuthContext.signIn iniciado");
      setError(null);
      const { user: loggedUser, accessToken: token } = await authService.login(
        email,
        password,
      );
      console.log("👤 Usuario recibido:", loggedUser);
      console.log("🔐 Token recibido:", token ? "Sí" : "No");
      setUser(loggedUser);
      setAccessToken(token);
      console.log("✅ Estado actualizado");
    } catch (err: any) {
      console.error("❌ Error en signIn:", err);
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => {
    try {
      setError(null);
      const { user, accessToken: token } = await authService.signup(
        email,
        password,
        name,
        role,
      );
      setUser(user);
      setAccessToken(token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      setAccessToken(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin: user?.role === "admin",
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
