import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { ServiceCategory } from "@/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdMiscellaneousServices } from "react-icons/md";

interface CategoriesCardProps {
  categories: ServiceCategory[];
  openCreateCategory: () => void;
  openEditCategory: (category: ServiceCategory) => void;
  handleDeleteCategory: (category: ServiceCategory) => void;
}

const CategoriesCard = ({
  categories,
  openCreateCategory,
  openEditCategory,
  handleDeleteCategory,
}: CategoriesCardProps) => {
  return (
    <>
      {categories.length === 0 ? (
        <EmptyState
          icon={<MdMiscellaneousServices />}
          title="No tienes categorías aún"
          description="Organiza tus servicios en categorías"
          action={
            <button
              onClick={openCreateCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Crear categoría
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <Card key={category.id}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <Badge
                  text={category.is_active ? "Activa" : "Inactiva"}
                  variant={category.is_active ? "success" : "gray"}
                />
              </div>
              {category.description && (
                <p className="text-gray-500 text-sm mb-3">
                  {category.description}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditCategory(category)}
                  className="flex-1 flex items-center justify-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-1.5 rounded-lg text-xs transition-colors"
                >
                  <FiEdit2 />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="flex items-center justify-center border border-red-100 hover:bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default CategoriesCard;
