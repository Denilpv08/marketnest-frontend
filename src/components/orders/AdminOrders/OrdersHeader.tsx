import { Order, OrderStatus } from "@/types";

interface OrdersHeaderProps {
  orders: Order[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  statusLabels: Record<OrderStatus, string>;
}

const OrdersHeader = ({
  orders,
  filterStatus,
  setFilterStatus,
  statusLabels,
}: OrdersHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} orden{orders.length !== 1 ? "es" : ""} en total
        </p>
      </div>

      {/* Filtro */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        <option value="all">Todos los estados</option>
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrdersHeader;
