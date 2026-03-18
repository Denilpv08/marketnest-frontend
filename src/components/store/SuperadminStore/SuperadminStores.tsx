"use client";
import { useState, useEffect } from "react";
import SuperadminLayout from "@/components/layout/superadmin/SuperadminLayout";
import { storesApi } from "@/lib/api";
import { Store, StoreStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiX,
  FiMapPin,
  FiPhone,
  FiMail,
  FiSearch,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const statusLabels: Record<StoreStatus, string> = {
  pending: "Pendiente",
  active: "Activa",
  suspended: "Suspendida",
};

const statusVariants: Record<StoreStatus, "warning" | "success" | "danger"> = {
  pending: "warning",
  active: "success",
  suspended: "danger",
};

const storeTypeLabels: Record<string, string> = {
  restaurant: "Restaurante",
  liquor_store: "Licorería",
  clothing: "Ropa",
  barbershop: "Peluquería",
  pharmacy: "Farmacia",
  hardware_store: "Ferretería",
  other: "Otro",
};

const SuperadminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filtered, setFiltered] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [search, filterStatus, stores]);

  const fetchStores = async () => {
    try {
      const data = await storesApi.getAll();
      setStores(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error:", error);
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
          s.city?.toLowerCase().includes(search.toLowerCase()) ||
          s.slug.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterStatus !== "all") {
      result = result.filter((s) => s.status === filterStatus);
    }
    setFiltered(result);
  };

  const handleStatusChange = async (storeId: number, status: StoreStatus) => {
    setUpdating(storeId);
    try {
      await storesApi.changeStatus(storeId, status);
      toast.success(
        status === StoreStatus.active
          ? "Tienda aprobada"
          : status === StoreStatus.suspended
            ? "Tienda suspendida"
            : "Estado actualizado",
      );
      fetchStores();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al actualizar");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <SuperadminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Establecimientos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {stores.length} establecimiento{stores.length !== 1 ? "s" : ""}{" "}
            registrados
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ciudad o slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<MdStorefront />}
            title="No hay establecimientos"
            description="No se encontraron establecimientos con esos criterios"
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: store.primary_color }}
                  >
                    {store.logo_url ? (
                      <img
                        src={store.logo_url}
                        alt={store.name}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <MdStorefront className="text-white text-xl" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">
                            {store.name}
                          </h3>
                          <Badge
                            text={statusLabels[store.status]}
                            variant={statusVariants[store.status]}
                          />
                          {store.store_type && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {store.custom_store_type ||
                                storeTypeLabels[store.store_type]}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5">
                          /{store.slug}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2 shrink-0">
                        {store.status !== StoreStatus.active && (
                          <button
                            onClick={() =>
                              handleStatusChange(store.id, StoreStatus.active)
                            }
                            disabled={updating === store.id}
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            {updating === store.id ? (
                              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheck />
                            )}
                            Aprobar
                          </button>
                        )}
                        {store.status !== StoreStatus.suspended && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                store.id,
                                StoreStatus.suspended,
                              )
                            }
                            disabled={updating === store.id}
                            className="flex items-center gap-1.5 border border-red-100 hover:bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <FiX />
                            Suspender
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {store.city && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <FiMapPin />
                          <span>{store.city}</span>
                        </div>
                      )}
                      {store.phone && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <FiPhone />
                          <span>{store.phone}</span>
                        </div>
                      )}
                      {store.contact_email && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <FiMail />
                          <span>{store.contact_email}</span>
                        </div>
                      )}
                      {store.tax_id && (
                        <div className="text-gray-500 text-xs">
                          NIT: {store.tax_id}
                        </div>
                      )}
                    </div>

                    {store.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-1">
                        {store.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SuperadminLayout>
  );
};

export default SuperadminStores;
