"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { storesApi, ordersApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import OrdersHeader from "./OrdersHeader";
import OrdersCard from "./OrdersCard";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  processing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const OrdersAdmin = () => {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stores = await storesApi.getMyStores();
      if (stores.length > 0) {
        setStoreId(stores[0].id);
        const data = await ordersApi.getByStore(stores[0].id);
        setOrders(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      await ordersApi.updateStatus(orderId, status);
      toast.success("Estado actualizado");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al actualizar");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <OrdersHeader
          orders={orders}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusLabels={statusLabels}
        />

        <OrdersCard
          statusLabels={statusLabels}
          updating={updating}
          handleUpdateStatus={handleUpdateStatus}
          filterStatus={filterStatus}
          orders={orders}
        />
      </div>
    </AdminLayout>
  );
};

export default OrdersAdmin;
