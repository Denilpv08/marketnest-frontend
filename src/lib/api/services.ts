import api from "@/lib/axios";
import { Service, ServiceCategory } from "@/types";

export const servicesApi = {
  getByStore: async (storeId: number): Promise<Service[]> => {
    const response = await api.get(`/api/services/store/${storeId}`);
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Service[]> => {
    const response = await api.get(`/api/services/category/${categoryId}`);
    return response.data;
  },

  getById: async (serviceId: number): Promise<Service> => {
    const response = await api.get(`/api/services/${serviceId}`);
    return response.data;
  },

  getCategories: async (storeId: number): Promise<ServiceCategory[]> => {
    const response = await api.get(`/api/services/store/${storeId}/categories`);
    return response.data;
  },

  createCategory: async (
    storeId: number,
    data: { name: string; description?: string },
  ): Promise<ServiceCategory> => {
    const response = await api.post(
      `/api/services/store/${storeId}/categories`,
      data,
    );
    return response.data;
  },

  updateCategory: async (
    categoryId: number,
    data: any,
  ): Promise<ServiceCategory> => {
    const response = await api.put(
      `/api/services/categories/${categoryId}`,
      data,
    );
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    await api.delete(`/api/services/categories/${categoryId}`);
  },

  create: async (storeId: number, data: any): Promise<Service> => {
    const response = await api.post(`/api/services/store/${storeId}`, data);
    return response.data;
  },

  update: async (serviceId: number, data: any): Promise<Service> => {
    const response = await api.put(`/api/services/${serviceId}`, data);
    return response.data;
  },

  delete: async (serviceId: number): Promise<void> => {
    await api.delete(`/api/services/${serviceId}`);
  },
};
