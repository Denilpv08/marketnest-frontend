import api from "@/lib/axios";
import { Product } from "@/types";

interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
}

interface UpdateProductData extends Partial<CreateProductData> {
  is_active?: boolean;
}

export const productsApi = {
  getByStore: async (storeId: number): Promise<Product[]> => {
    const response = await api.get(`/api/products/store/${storeId}`);
    return response.data;
  },

  getAllByStore: async (storeId: number): Promise<Product[]> => {
    const response = await api.get(`/api/products/store/${storeId}/all`);
    return response.data;
  },

  getById: async (productId: number): Promise<Product> => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  },

  create: async (
    storeId: number,
    data: CreateProductData,
  ): Promise<Product> => {
    const response = await api.post(`/api/products/store/${storeId}`, data);
    return response.data;
  },

  update: async (
    productId: number,
    data: UpdateProductData,
  ): Promise<Product> => {
    const response = await api.put(`/api/products/${productId}`, data);
    return response.data;
  },

  delete: async (productId: number): Promise<void> => {
    await api.delete(`/api/products/${productId}`);
  },
};
