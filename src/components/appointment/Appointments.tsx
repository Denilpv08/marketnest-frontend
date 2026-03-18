"use client";
import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { appointmentsApi } from "@/lib/api";
import { Appointment } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { FiCalendar } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AppointmentsCard from "./AppointmentsCard";

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
              <AppointmentsCard
                key={appointment.id}
                appointment={appointment}
                handleCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Appointments;
