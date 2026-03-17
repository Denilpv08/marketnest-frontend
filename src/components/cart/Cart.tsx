"use client";
import { useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import { ordersApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";

const Cart = () => {
  const { cart, fetchCart, removeFromCart, updateQuantity, emptyCart } =
    useCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchCart().finally(() => setLoading(false));
  }, [isAuthenticated]);

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

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi carrito</h1>

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
            <div className="flex-1 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4"
                >
                  {/* Imagen */}
                  <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <FiShoppingCart className="text-gray-300 text-2xl" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-blue-600 font-bold mt-1">
                      ${item.product.price.toLocaleString()}
                    </p>

                    {/* Controles cantidad */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeFromCart(item.id)
                          }
                          className="p-1.5 hover:bg-gray-50 rounded-l-lg transition-colors"
                        >
                          <FiMinus className="text-gray-600 text-sm" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="p-1.5 hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-50"
                        >
                          <FiPlus className="text-gray-600 text-sm" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="font-bold text-gray-900">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Vaciar carrito */}
              <button
                onClick={emptyCart}
                className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1.5 transition-colors"
              >
                <FiTrash2 />
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <div className="lg:w-80">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 text-lg mb-4">
                  Resumen del pedido
                </h2>

                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {checkingOut ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar pedido"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Cart;
