import api from "@/lib/axios";
import { Cart, CartItem } from "@/types";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get("/api/cart/");
    return response.data;
  },

  addItem: async (productId: number, quantity: number): Promise<CartItem> => {
    const response = await api.post("/api/cart/", {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<CartItem> => {
    const response = await api.put(`/api/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/api/cart/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete("/api/cart/");
  },
};
