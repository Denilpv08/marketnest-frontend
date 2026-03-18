import { useCart } from "@/hooks/useCart";
import { ordersApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";
import EmptyState from "../ui/EmptyState";
import CartList from "./CartList";
import CartSummary from "./CartSummary";

const CartCards = () => {
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const { cart, updateQuantity, removeFromCart, emptyCart } = useCart();

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    setCheckingOut(true);
    try {
      const order = await ordersApi.create();
      await emptyCart();
      toast.success("¡Orden creada exitosamente!");
      router.push(`/orders/${order.id}`);
    } catch (error: any) {
      const message = error.response?.data?.detail || "Error al crear la orden";
      toast.error(message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      {!cart || cart.items.length === 0 ? (
        <EmptyState
          icon={<FiShoppingCart />}
          title="Tu carrito está vacío"
          description="Agrega productos de tus tiendas favoritas"
          action={
            <Link
              href="/stores"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Ver tiendas
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de items */}
          <CartList
            items={cart.items}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            emptyCart={emptyCart}
          />

          {/* Resumen */}
          <CartSummary
            cart={cart}
            checkingOut={checkingOut}
            handleCheckout={handleCheckout}
          />
        </div>
      )}
    </>
  );
};

export default CartCards;
