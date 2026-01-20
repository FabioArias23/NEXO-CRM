import { supabase } from "../supabase";
import type { UserRole } from "../../core/types";

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout después de ${ms}ms`)), ms),
    ),
  ]);
};

export const authQueries = {
  async login(email: string, password: string) {
    console.log(
      "🔌 authQueries.login: Llamando a supabase.auth.signInWithPassword",
      { email },
    );

    try {
      const result = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000, // 10 segundos timeout
      );

      console.log("📨 supabase.auth.signInWithPassword respuesta:", {
        hasData: !!result.data,
        hasUser: !!result.data?.user,
        hasSession: !!result.data?.session,
        error: result.error,
      });
      return result;
    } catch (err) {
      console.error("💥 Error o timeout en login:", err);
      throw err;
    }
  },

  async logout() {
    return await supabase.auth.signOut();
  },

  async signup(email: string, password: string, name: string, role: UserRole) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });
  },

  async getCurrentSession() {
    return await supabase.auth.getSession();
  },

  async getCurrentUser() {
    return await supabase.auth.getUser();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return () => subscription?.unsubscribe();
  },
};


