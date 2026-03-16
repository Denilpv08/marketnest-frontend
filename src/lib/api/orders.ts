import api from "@/lib/axios";
import { Order } from "@/types";

export const ordersApi = {
  create: async (): Promise<Order> => {
    const response = await api.post("/api/orders/");
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get("/api/orders/my");
    return response.data;
  },

  getById: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  getByStore: async (storeId: number): Promise<Order[]> => {
    const response = await api.get(`/api/orders/store/${storeId}`);
    return response.data;
  },

  updateStatus: async (orderId: number, status: string): Promise<Order> => {
    const response = await api.patch(`/api/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },
};
