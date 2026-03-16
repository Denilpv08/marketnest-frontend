import { useState, useEffect } from "react";
import { storesApi } from "@/lib/api";
import { Store } from "@/types";
import toast from "react-hot-toast";

interface UpdateStoreData {
  name?: string;
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
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  banner_url?: string;
}

export const useStore = (slug?: string) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchStore();
  }, [slug]);

  const fetchStore = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await storesApi.getBySlug(slug);
      setStore(data);
    } catch (error: any) {
      setError("Tienda no encontrada");
    } finally {
      setLoading(false);
    }
  };

  const updateStore = async (storeId: number, data: UpdateStoreData) => {
    try {
      const updated = await storesApi.update(storeId, data);
      setStore(updated);
      toast.success("Tienda actualizada correctamente");
      return updated;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Error al actualizar la tienda";
      toast.error(message);
      throw error;
    }
  };

  return { store, loading, error, fetchStore, updateStore };
};
