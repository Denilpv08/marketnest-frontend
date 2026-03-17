"use client";
import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { ordersApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  processing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const statusVariants: Record<
  OrderStatus,
  "warning" | "success" | "info" | "gray" | "danger"
> = {
  pending: "warning",
  paid: "success",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mis órdenes</h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag />}
            title="No tienes órdenes aún"
            description="Cuando realices una compra aparecerá aquí"
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
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Orden #{order.id}
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {new Date(order.created_at).toLocaleDateString(
                          "es-CO",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        text={statusLabels[order.status]}
                        variant={statusVariants[order.status]}
                      />
                      <FiArrowRight className="text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">
                      {order.items.length} producto
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="font-bold text-blue-600">
                      ${order.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Orders;
