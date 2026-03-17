"use client";
import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { appointmentsApi } from "@/lib/api";
import { Appointment, AppointmentStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { FiCalendar, FiClock, FiX } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

const statusVariants: Record<
  AppointmentStatus,
  "warning" | "success" | "info" | "gray" | "danger"
> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "gray",
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchAppointments();
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentsApi.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await appointmentsApi.cancel(id);
      toast.success("Cita cancelada");
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al cancelar");
    }
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

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mis citas</h1>

        {appointments.length === 0 ? (
          <EmptyState
            icon={<FiCalendar />}
            title="No tienes citas agendadas"
            description="Agenda una cita en cualquier tienda que lo permita"
            action={
              <a
                href="/stores"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Ver tiendas
              </a>
            }
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {appointment.service?.name || "Visita general"}
                    </p>
                    {appointment.service?.category && (
                      <p className="text-blue-600 text-xs mt-0.5">
                        {appointment.service.category.name}
                      </p>
                    )}
                  </div>
                  <Badge
                    text={statusLabels[appointment.status]}
                    variant={statusVariants[appointment.status]}
                  />
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar />
                    <span>
                      {new Date(appointment.date).toLocaleDateString("es-CO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock />
                    <span>{appointment.time}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <p className="text-gray-500 text-sm bg-gray-50 rounded-lg px-3 py-2 mb-3">
                    {appointment.notes}
                  </p>
                )}

                {appointment.admin_notes && (
                  <p className="text-blue-600 text-sm bg-blue-50 rounded-lg px-3 py-2 mb-3">
                    Nota del negocio: {appointment.admin_notes}
                  </p>
                )}

                {(appointment.status === "pending" ||
                  appointment.status === "confirmed") && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-600 text-sm transition-colors"
                  >
                    <FiX />
                    Cancelar cita
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Appointments;
