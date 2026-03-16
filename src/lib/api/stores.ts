import api from "@/lib/axios";
import { Store } from "@/types";

interface CreateStoreData {
  name: string;
  slug: string;
  description?: string;
  store_type?: string;
  custom_store_type?: string;
  business_type?: string;
  tax_id?: string;
  phone?: string;
  contact_email?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: Record<string, { open: string; close: string } | null>;
  allows_appointments?: boolean;
}

interface UpdateStoreData extends Partial<CreateStoreData> {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  banner_url?: string;
}

export const storesApi = {
  create: async (data: CreateStoreData): Promise<Store> => {
    const response = await api.post("/api/stores/", data);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Store> => {
    const response = await api.get(`/api/stores/${slug}`);
    return response.data;
  },

  getMyStores: async (): Promise<Store[]> => {
    const response = await api.get("/api/stores/");
    return response.data;
  },

  update: async (storeId: number, data: UpdateStoreData): Promise<Store> => {
    const response = await api.put(`/api/stores/${storeId}`, data);
    return response.data;
  },

  // Superadmin
  getAll: async (): Promise<Store[]> => {
    const response = await api.get("/api/admin/stores");
    return response.data;
  },

  getPending: async (): Promise<Store[]> => {
    const response = await api.get("/api/admin/stores/pending");
    return response.data;
  },

  changeStatus: async (storeId: number, status: string): Promise<Store> => {
    const response = await api.patch(`/api/admin/stores/${storeId}/status`, {
      status,
    });
    return response.data;
  },
};
