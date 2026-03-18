import { FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { CartItem } from "@/types";

interface CartListProps {
  items: CartItem[];
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  emptyCart: () => Promise<void>;
}

const CartList = ({
  items,
  updateQuantity,
  removeFromCart,
  emptyCart,
}: CartListProps) => {
  return (
    <div className="flex-1 space-y-4">
      {items.map((item) => (
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
            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
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
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
  );
};

export default CartList;
