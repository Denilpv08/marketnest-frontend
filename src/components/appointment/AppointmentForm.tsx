"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { storesApi, servicesApi, appointmentsApi } from "@/lib/api";
import { Store, Service } from "@/types";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FiCalendar, FiClock, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

const AppointmentForm = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [store, setStore] = useState<Store | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    service_id: searchParams.get("service") || "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const storeData = await storesApi.getBySlug(slug as string);
      setStore(storeData);
      if (
        storeData.business_type === "services" ||
        storeData.business_type === "products_services"
      ) {
        const servicesData = await servicesApi.getByStore(storeData.id);
        setServices(servicesData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    if (!formData.date || !formData.time) {
      toast.error("Selecciona fecha y hora");
      return;
    }

    setSubmitting(true);
    try {
      await appointmentsApi.create({
        store_id: store.id,
        service_id: formData.service_id
          ? Number(formData.service_id)
          : undefined,
        date: formData.date,
        time: `${formData.time}:00`,
        notes: formData.notes || undefined,
      });
      toast.success("¡Cita agendada exitosamente!");
      router.push("/appointments");
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Error al agendar la cita";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (!store) {
    return (
      <PublicLayout>
        <div className="py-20 text-center text-gray-500">
          Tienda no encontrada
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/stores/${slug}`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendar cita</h1>
            <p className="text-gray-500 text-sm mt-1">{store.name}</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Servicio */}
            {services.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio (opcional)
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) =>
                    setFormData({ ...formData, service_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Seleccionar servicio...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} — ${service.price.toLocaleString()} —{" "}
                      {service.duration} {service.duration_unit}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  min={getTodayDate()}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Escribe cualquier detalle adicional..."
                rows={3}
                className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            {/* Horarios de la tienda */}
            {store.opening_hours && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1.5">
                  <FiClock />
                  Horarios de atención
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries({
                    monday: "Lunes",
                    tuesday: "Martes",
                    wednesday: "Miércoles",
                    thursday: "Jueves",
                    friday: "Viernes",
                    saturday: "Sábado",
                    sunday: "Domingo",
                  }).map(([key, label]) => {
                    const hours = store.opening_hours?.[key];
                    return (
                      <div key={key} className="text-xs text-blue-600">
                        <span className="font-medium">{label}: </span>
                        {hours ? `${hours.open} - ${hours.close}` : "Cerrado"}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <FiCalendar />
                  Confirmar cita
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AppointmentForm;
