import api from "@/lib/axios";
import { TokenResponse, User } from "@/types";

interface RegisterData {
  name: string;
  last_name?: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  last_name?: string;
  email?: string;
  identity_type?: string;
  identity_number?: string;
  city?: string;
  address?: string;
  photo_url?: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<TokenResponse> => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<TokenResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put("/api/users/me", data);
    return response.data;
  },
};
