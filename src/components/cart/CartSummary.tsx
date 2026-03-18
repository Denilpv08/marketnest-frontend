interface CartSummaryProps {
  cart: {
    items: {
      id: number;
      quantity: number;
      product: {
        name: string;
        price: number;
      };
    }[];
    total: number;
  } | null;
  checkingOut: boolean;
  handleCheckout: () => void;
}

const CartSummary = ({
  cart,
  checkingOut,
  handleCheckout,
}: CartSummaryProps) => {
  return (
    <div className="lg:w-80">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
        <h2 className="font-bold text-gray-900 text-lg mb-4">
          Resumen del pedido
        </h2>

        <div className="space-y-3 mb-4">
          {cart?.items.map((item) => (
            <div
              key={item.id}
              className="flex text-blue-600 justify-between text-sm"
            >
              <span className="text-gray-600">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium">
                ${(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t text-gray-600 border-gray-100 pt-4 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">
              ${cart?.total.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {checkingOut ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            "Confirmar pedido"
          )}
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
