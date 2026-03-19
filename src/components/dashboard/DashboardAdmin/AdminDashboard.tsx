"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { dashboardApi, storesApi } from "@/lib/api";
import { DashboardStore, Store } from "@/types";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import DashboardCard from "./DashboardCard";
import DashboardGraphs from "./DashboardGraphs";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [store, setStore] = useState<Store | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stores = await storesApi.getMyStores();
      if (stores.length > 0) {
        setStore(stores[0]);
        const data = await dashboardApi.getStoreDashboard(stores[0].id);
        setDashboard(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {store ? `Tienda: ${store.name}` : "No tienes una tienda aún"}
        </p>
      </div>

      {!store ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Aún no tienes una tienda creada
            </p>
            <a
              href="/admin/store"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Crear mi tienda
            </a>
          </div>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard dashboard={dashboard} />
          </div>

          <DashboardGraphs dashboard={dashboard} />
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
