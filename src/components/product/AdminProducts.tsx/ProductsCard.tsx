import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { Product } from "@/types";
import { FiEdit2, FiPackage, FiTrash2 } from "react-icons/fi";

interface ProductsCardProps {
  products: Product[];
  openEdit: (product: Product) => void;
  openCreate: () => void;
  handleDelete: (product: Product) => void;
}

const ProductsCard = ({
  products,
  openEdit,
  openCreate,
  handleDelete,
}: ProductsCardProps) => {
  return (
    <>
      {products.length === 0 ? (
        <EmptyState
          icon={<FiPackage />}
          title="No tienes productos aún"
          description="Crea tu primer producto para empezar a vender"
          action={
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Crear producto
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <Card key={product.id} padding="sm">
              {/* Imagen */}
              <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiPackage className="text-gray-300 text-4xl" />
                )}
              </div>

              {/* Info */}
              <div className="px-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {product.name}
                  </h3>
                  <Badge
                    text={product.is_active ? "Activo" : "Inactivo"}
                    variant={product.is_active ? "success" : "gray"}
                  />
                </div>

                <p className="text-blue-600 font-bold mt-1">
                  ${product.price.toLocaleString()}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-xs ${
                      product.stock === 0
                        ? "text-red-500"
                        : product.stock <= 5
                          ? "text-orange-500"
                          : "text-gray-500"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <FiEdit2 />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex items-center justify-center gap-1 border border-red-100 hover:bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductsCard;
