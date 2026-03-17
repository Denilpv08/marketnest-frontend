"use client";
import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { storesApi } from "@/lib/api";
import { Store, StoreType } from "@/types";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { FiSearch, FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

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
              <Link href={`/stores/${store.slug}`} key={store.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  {/* Banner */}
                  <div
                    className="h-32 relative"
                    style={{
                      background: store.banner_url
                        ? `url(${store.banner_url}) center/cover`
                        : `linear-gradient(135deg, ${store.primary_color}, ${store.secondary_color})`,
                    }}
                  >
                    {/* Logo */}
                    <div className="absolute -bottom-6 left-4">
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.name}
                          className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow"
                        />
                      ) : (
                        <div
                          className="h-12 w-12 rounded-xl border-2 border-white shadow flex items-center justify-center"
                          style={{ background: store.primary_color }}
                        >
                          <MdStorefront className="text-white text-xl" />
                        </div>
                      )}
                    </div>

                    {/* Badge abierto/cerrado */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          isOpen(store)
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isOpen(store) ? "Abierto" : "Cerrado"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-8 pb-4 px-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {store.name}
                      </h3>
                      {store.store_type && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {store.custom_store_type ||
                            storeTypeLabels[store.store_type]}
                        </span>
                      )}
                    </div>

                    {store.description && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {store.description}
                      </p>
                    )}

                    <div className="space-y-1">
                      {store.city && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <FiMapPin className="shrink-0" />
                          <span>{store.city}</span>
                        </div>
                      )}
                      {store.phone && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <FiPhone className="shrink-0" />
                          <span>{store.phone}</span>
                        </div>
                      )}
                      {store.allows_appointments && (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs">
                          <FiClock className="shrink-0" />
                          <span>Acepta citas</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Stores;
