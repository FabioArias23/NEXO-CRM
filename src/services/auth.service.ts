import { authQueries } from "../client/queries/auth.queries";
import { User, AuthResponse, ApiError, UserRole } from "../core/types";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("🔄 authService.login: Llamando a authQueries.login");
      const { data, error } = await authQueries.login(email, password);
      console.log("📦 authQueries.login respuesta:", {
        hasData: !!data,
        error,
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error("Credenciales inválidas");
      }

      console.log("✅ Auth exitoso, creando usuario desde metadata");

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || "",
        role: data.user.user_metadata?.role || "employee",
      };

      console.log("👤 Usuario final creado:", user);
      console.log(
        "🎫 Access token:",
        data.session.access_token ? "Presente" : "Ausente",
      );

      return { user, accessToken: data.session.access_token };
    } catch (error: any) {
      console.error("💥 Error en authService.login:", error);
      throw this._handleError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await authQueries.logout();
      if (error) throw error;
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  async signup(
    email: string,
    password: string,
    name: string,
    role: UserRole = "employee",
  ): Promise<AuthResponse> {
    try {
      if (!email || !password || !name) {
        throw new Error("Email, contraseña y nombre son requeridos");
      }
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const { data, error } = await authQueries.signup(
        email,
        password,
        name,
        role,
      );
      if (error) throw error;

      // Auto-login después de signup
      try {
        // Retornar el resultado completo del login (user + token)
        return await this.login(email, password);
      } catch (loginError: any) {
        if (data?.user && !data?.session) {
          throw new Error(
            "Email registrado pero pendiente de confirmación. Revisa tu correo o desactiva la confirmación de email en Supabase.",
          );
        }

        if (data?.session?.access_token && data?.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || "",
            role: data.user.user_metadata?.role || "employee",
          };

          return { user, accessToken: data.session.access_token };
        }

        throw loginError;
      }
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await authQueries.getCurrentUser();
      if (error || !data.user) return null;

      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || "",
        role: data.user.user_metadata?.role || "employee",
      };
    } catch {
      return null;
    }
  },

  async getSession() {
    try {
      const { data } = await authQueries.getCurrentSession();
      return data.session;
    } catch {
      return null;
    }
  },

  onAuthChange(callback: (user: User | null) => void) {
    return authQueries.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || "",
          role: session.user.user_metadata?.role || "employee",
        });
      } else {
        callback(null);
      }
    });
  },

  _handleError(error: any): ApiError {
    return {
      code: error.code || "AUTH_ERROR",
      message: error.message || "Error en autenticación",
      details: error,
    };
  },
};
