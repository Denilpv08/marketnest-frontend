import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      setAuth(data.user, data.access_token);
      toast.success(`Bienvenido ${data.user.name}!`);

      // Redirigir según el rol
      if (data.user.role === "superadmin") {
        router.push("/superadmin/dashboard");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || "Error al iniciar sesión";
      toast.error(message);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    try {
      const data = await authApi.register({ name, email, password, role });
      setAuth(data.user, data.access_token);
      toast.success("Cuenta creada exitosamente");
      router.push("/");
    } catch (error: any) {
      const message = error.response?.data?.detail || "Error al registrarse";
      toast.error(message);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    router.push("/auth/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
  };
};
