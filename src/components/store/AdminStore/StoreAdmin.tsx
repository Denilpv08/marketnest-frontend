"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { storesApi } from "@/lib/api";
import { Store } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { FiSave } from "react-icons/fi";
import StoreCreate from "./StoreCreate";
import StoreInfoBasic from "./StoreInfoBasic";
import StoreContact from "./StoreContact";
import StoreCustomisation from "./StoreCustomisation";
import StoreTime from "./StoreTime";

const storeTypeOptions = [
  { value: "restaurant", label: "Restaurante" },
  { value: "liquor_store", label: "Licorería" },
  { value: "clothing", label: "Ropa" },
  { value: "barbershop", label: "Peluquería" },
  { value: "pharmacy", label: "Farmacia" },
  { value: "hardware_store", label: "Ferretería" },
  { value: "other", label: "Otro" },
];

const businessTypeOptions = [
  { value: "products", label: "Solo productos" },
  { value: "services", label: "Solo servicios" },
  { value: "products_services", label: "Productos y servicios" },
];

const StoreAdmin = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    store_type: "",
    custom_store_type: "",
    business_type: "products",
    tax_id: "",
    phone: "",
    contact_email: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    primary_color: "#3B82F6",
    secondary_color: "#1E40AF",
    allows_appointments: false,
    opening_hours: {} as Record<string, { open: string; close: string } | null>,
  });

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const stores = await storesApi.getMyStores();
      if (stores.length > 0) {
        const s = stores[0];
        setStore(s);
        setFormData({
          name: s.name || "",
          slug: s.slug || "",
          description: s.description || "",
          store_type: s.store_type || "",
          custom_store_type: s.custom_store_type || "",
          business_type: s.business_type || "products",
          tax_id: s.tax_id || "",
          phone: s.phone || "",
          contact_email: s.contact_email || "",
          city: s.city || "",
          address: s.address || "",
          latitude: s.latitude?.toString() || "",
          longitude: s.longitude?.toString() || "",
          primary_color: s.primary_color || "#3B82F6",
          secondary_color: s.secondary_color || "#1E40AF",
          allows_appointments: s.allows_appointments || false,
          opening_hours: s.opening_hours || {},
        });
      } else {
        setShowCreateForm(true);
      }
    } catch (error) {
      setShowCreateForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    setSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description || undefined,
        store_type: formData.store_type || undefined,
        custom_store_type:
          formData.store_type === "other"
            ? formData.custom_store_type
            : undefined,
        business_type: formData.business_type,
        tax_id: formData.tax_id || undefined,
        phone: formData.phone || undefined,
        contact_email: formData.contact_email || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : undefined,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        allows_appointments: formData.allows_appointments,
        opening_hours: formData.opening_hours,
      };
      const updated = await storesApi.update(store.id, payload);
      setStore(updated);
      toast.success("Tienda actualizada correctamente");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (showCreateForm) {
    return (
      <StoreCreate
        saving={saving}
        setSaving={setSaving}
        setStore={setStore}
        setShowCreateForm={setShowCreateForm}
        formData={formData}
        handleChange={handleChange}
        storeTypeOptions={storeTypeOptions}
        businessTypeOptions={businessTypeOptions}
      />
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mi tienda</h1>
            <p className="text-gray-500 text-sm mt-1">
              Estado:{" "}
              <span
                className={`font-medium ${
                  store?.status === "active"
                    ? "text-green-600"
                    : store?.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {store?.status === "active"
                  ? "Activa"
                  : store?.status === "pending"
                    ? "Pendiente de aprobación"
                    : "Suspendida"}
              </span>
            </p>
          </div>
          {store && (
            <a
              href={`/stores/${store.slug}`}
              target="_blank"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver mi tienda →
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <StoreInfoBasic
            formData={formData}
            handleChange={handleChange}
            storeTypeOptions={storeTypeOptions}
            businessTypeOptions={businessTypeOptions}
          />

          {/* Contacto */}
          <StoreContact formData={formData} handleChange={handleChange} />

          {/* Personalización */}
          <StoreCustomisation formData={formData} handleChange={handleChange} />

          {/* Citas y horarios */}
          <StoreTime
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />

          {/* Botón guardar */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FiSave />
                Guardar cambios
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default StoreAdmin;
