"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { ordersApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Badge from "@/components/ui/Badge";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

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

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await ordersApi.getById(Number(id));
      setOrder(data);
    } catch (error) {
      console.error("Error al obtener la orden:", error);
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

  if (!order) {
    return (
      <PublicLayout>
        <div className="py-20 text-center text-gray-500">
          Orden no encontrada
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/orders"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orden #{order.id}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date(order.created_at).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="ml-auto">
            <Badge
              text={statusLabels[order.status]}
              variant={statusVariants[order.status]}
            />
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiShoppingBag />
            Productos ordenados
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Producto #{item.product_id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Cantidad: {item.quantity} x $
                    {item.unit_price.toLocaleString()}
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  ${(item.quantity * item.unit_price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
            <span className="font-bold text-gray-900 text-lg">Total</span>
            <span className="font-bold text-blue-600 text-xl">
              ${order.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <Link
            href="/orders"
            className="flex-1 text-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
          >
            Ver todas mis órdenes
          </Link>
          <Link
            href="/stores"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderDetail;
