import Card from "@/components/ui/Card";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardGraphsProps {
  dashboard: {
    low_stock_products: { id: number; name: string; stock: number }[];
    out_of_stock_products: { id: number; name: string }[];
  } | null;
}

const DashboardGraphs = ({ dashboard }: DashboardGraphsProps) => {
  const stockChartData = dashboard?.low_stock_products.map((p) => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
    stock: p.stock,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Productos con bajo stock */}
      {dashboard && dashboard.low_stock_products.length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-orange-500" />
            Productos con bajo stock
          </h2>
          <ResponsiveContainer width="100%" height={250} className="text-black">
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Productos sin stock */}
      {dashboard && dashboard.out_of_stock_products.length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-red-500" />
            Productos agotados
          </h2>
          <div className="space-y-3">
            {dashboard.out_of_stock_products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <p className="text-gray-700 text-sm">{product.name}</p>
                <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">
                  Agotado
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sin alertas */}
      {dashboard &&
        dashboard.low_stock_products.length === 0 &&
        dashboard.out_of_stock_products.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <p className="text-green-600 font-medium">
                ✅ Todo el inventario está en buen estado
              </p>
            </div>
          </Card>
        )}
    </div>
  );
};

export default DashboardGraphs;
