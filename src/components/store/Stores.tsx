"use client";
import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { storesApi } from "@/lib/api";
import { Store, StoreType } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { FiSearch } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import StoresCard from "./StoresCard";

const storeTypeLabels: Record<StoreType, string> = {
  restaurant: "Restaurante",
  liquor_store: "Licorería",
  clothing: "Ropa",
  barbershop: "Peluquería",
  pharmacy: "Farmacia",
  hardware_store: "Ferretería",
  other: "Otro",
};

const Stores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filtered, setFiltered] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [search, selectedType, stores]);

  const fetchStores = async () => {
    try {
      const data = await storesApi.getPublic();
      const activeStores = data.filter((s) => s.status === "active");
      setStores(activeStores);
      setFiltered(activeStores);
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterStores = () => {
    let result = stores;
    if (search) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.city?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (selectedType !== "all") {
      result = result.filter((s) => s.store_type === selectedType);
    }
    setFiltered(result);
  };

  const isOpen = (store: Store): boolean => {
    if (!store.opening_hours) return false;
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    const hours = store.opening_hours[today];
    if (!hours) return false;
    const now = new Date();
    const current = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    return current >= hours.open && current <= hours.close;
  };

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Explora nuestras tiendas</h1>
          <p className="text-blue-100">
            Encuentra lo que necesitas cerca de ti
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="all">Tipo de restaurantes</option>
            {Object.entries(storeTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de tiendas */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MdStorefront />}
            title="No hay tiendas disponibles"
            description="No encontramos tiendas con esos criterios de búsqueda"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((store) => (
              <StoresCard
                key={store.id}
                store={store}
                isOpen={isOpen}
                storeTypeLabels={storeTypeLabels}
              />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Stores;
