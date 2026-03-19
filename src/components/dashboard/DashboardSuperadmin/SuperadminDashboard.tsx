"use client";
import { useState, useEffect } from "react";
import SuperadminLayout from "@/components/layout/superadmin/SuperadminLayout";
import { dashboardApi } from "@/lib/api";
import { DashboardSuperadmin } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FiDollarSign, FiShoppingBag, FiUsers } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const SuperadminDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardSuperadmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await dashboardApi.getSuperadminDashboard();
      setDashboard(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const storeChartData = dashboard
    ? [
        { name: "Activas", value: dashboard.active_stores },
        { name: "Pendientes", value: dashboard.pending_stores },
        { name: "Suspendidas", value: dashboard.suspended_stores },
      ]
    : [];

  const statsCards = dashboard
    ? [
        {
          label: "Ingresos totales",
          value: `$${dashboard.total_revenue.toLocaleString()}`,
          icon: FiDollarSign,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Órdenes pagadas",
          value: dashboard.total_orders,
          icon: FiShoppingBag,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Total tiendas",
          value: dashboard.total_stores,
          icon: MdStorefront,
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
        {
          label: "Total usuarios",
          value: dashboard.total_users,
          icon: FiUsers,
          color: "text-indigo-600",
          bg: "bg-indigo-100",
        },
      ]
    : [];

  if (loading) {
    return (
      <SuperadminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard global 🌐
          </h1>
          <p className="text-gray-500 mt-1">
            Vista general de toda la plataforma
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} padding="md">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <Icon className={`${stat.color} text-xl`} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfica tiendas */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">
              Estado de tiendas
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={storeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storeChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Resumen */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">
              Resumen del sistema
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-600">Tiendas activas</span>
                <span className="font-bold text-green-600">
                  {dashboard?.active_stores}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-600">Tiendas pendientes</span>
                <span className="font-bold text-yellow-600">
                  {dashboard?.pending_stores}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-600">Tiendas suspendidas</span>
                <span className="font-bold text-red-600">
                  {dashboard?.suspended_stores}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Total usuarios</span>
                <span className="font-bold text-gray-900">
                  {dashboard?.total_users}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SuperadminLayout>
  );
};

export default SuperadminDashboard;
