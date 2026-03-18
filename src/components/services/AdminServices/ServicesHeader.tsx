import { Service, ServiceCategory } from "@/types";
import { FiPlus } from "react-icons/fi";

interface ServicesHeaderProps {
  activeTab: "services" | "categories";
  setActiveTab: (tab: "services" | "categories") => void;
  services: Service[];
  categories: ServiceCategory[];
  openCreateService: () => void;
  openCreateCategory: () => void;
}

const ServicesHeader = ({
  activeTab,
  setActiveTab,
  services,
  categories,
  openCreateService,
  openCreateCategory,
}: ServicesHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
        <button
          onClick={
            activeTab === "services" ? openCreateService : openCreateCategory
          }
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <FiPlus />
          {activeTab === "services" ? "Nuevo servicio" : "Nueva categoría"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("services")}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "services"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Servicios ({services.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "categories"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Categorías ({categories.length})
        </button>
      </div>
    </>
  );
};

export default ServicesHeader;
