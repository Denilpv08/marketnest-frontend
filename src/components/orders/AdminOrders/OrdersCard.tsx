import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Order, OrderStatus } from "@/types";
import { FiChevronDown, FiShoppingBag } from "react-icons/fi";

interface OrdersCardProps {
  statusLabels: Record<OrderStatus, string>;
  updating: number | null;
  handleUpdateStatus: (id: number, status: OrderStatus) => void;
  filterStatus: string;
  orders: Order[];
}

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

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: OrderStatus.processing,
  processing: OrderStatus.shipped,
  shipped: OrderStatus.delivered,
};

const OrdersCard = ({
  statusLabels,
  updating,
  handleUpdateStatus,
  filterStatus,
  orders,
}: OrdersCardProps) => {
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <>
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<FiShoppingBag />}
          title="No hay órdenes"
          description="Las órdenes de tus clientes aparecerán aquí"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const upcomingStatus = nextStatus[order.status];

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Orden #{order.id}
                    </p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      text={statusLabels[order.status]}
                      variant={statusVariants[order.status]}
                    />
                    <p className="font-bold text-blue-600">
                      ${order.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        Producto #{item.product_id} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.unit_price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Acciones */}
                {upcomingStatus && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, upcomingStatus)
                      }
                      disabled={updating === order.id}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {updating === order.id ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiChevronDown />
                      )}
                      Marcar como {statusLabels[upcomingStatus]}
                    </button>

                    {order.status !== OrderStatus.cancelled && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order.id, OrderStatus.cancelled)
                        }
                        disabled={updating === order.id}
                        className="border border-red-100 hover:bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default OrdersCard;
