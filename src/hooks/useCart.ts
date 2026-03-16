import { useCartStore } from "@/store/cartStore";
import { cartApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export const useCart = () => {
  const { cart, itemCount, setCart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    try {
      await cartApi.addItem(productId, quantity);
      await fetchCart();
      toast.success("Producto agregado al carrito");
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Error al agregar al carrito";
      toast.error(message);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await cartApi.removeItem(itemId);
      await fetchCart();
      toast.success("Producto eliminado del carrito");
    } catch (error: any) {
      toast.error("Error al eliminar el producto");
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, quantity);
      await fetchCart();
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Error al actualizar la cantidad";
      toast.error(message);
    }
  };

  const emptyCart = async () => {
    try {
      await cartApi.clearCart();
      clearCart();
      toast.success("Carrito vaciado");
    } catch (error: any) {
      toast.error("Error al vaciar el carrito");
    }
  };

  return {
    cart,
    itemCount,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
  };
};
