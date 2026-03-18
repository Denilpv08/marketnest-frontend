import Card from "@/components/ui/Card";
import { DashboardStore } from "@/types";
import { FiDollarSign, FiPackage, FiShoppingBag } from "react-icons/fi";

interface DashboardCardProps {
  dashboard: DashboardStore | null;
}

const DashboardCard = ({ dashboard }: DashboardCardProps) => {
  const statsCards = dashboard
    ? [
        {
          label: "Ventas totales",
          value: `$${dashboard.total_sales.toLocaleString()}`,
          icon: FiDollarSign,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Órdenes totales",
          value: dashboard.total_orders,
          icon: FiShoppingBag,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Órdenes pagadas",
          value: dashboard.paid_orders,
          icon: FiShoppingBag,
          color: "text-indigo-600",
          bg: "bg-indigo-100",
        },
        {
          label: "Productos activos",
          value: dashboard.total_products,
          icon: FiPackage,
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
      ]
    : [];

  return (
    <>
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
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default DashboardCard;
