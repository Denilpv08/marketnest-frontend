"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { storesApi, appointmentsApi } from "@/lib/api";
import { Appointment, AppointmentStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import toast from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import ApointmentHeader from "./ApointmentHeader";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentsCard from "./AppointmentsCard";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

const AppointmentAdmin = () => {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [showNotesFor, setShowNotesFor] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stores = await storesApi.getMyStores();
      if (stores.length > 0) {
        setStoreId(stores[0].id);
        const data = await appointmentsApi.getByStore(
          stores[0].id,
          filterDate || undefined,
        );
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterDate = async (date: string) => {
    setFilterDate(date);
    if (!storeId) return;
    try {
      const data = await appointmentsApi.getByStore(storeId, date || undefined);
      setAppointments(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateStatus = async (
    appointmentId: number,
    status: AppointmentStatus,
  ) => {
    setUpdating(appointmentId);
    try {
      await appointmentsApi.updateStatus(
        appointmentId,
        status,
        adminNotes[appointmentId],
      );
      toast.success("Estado actualizado");
      setShowNotesFor(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al actualizar");
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments =
    filterStatus === "all"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <ApointmentHeader appointments={appointments} />

        {/* Filtros */}
        <AppointmentFilters
          filterDate={filterDate}
          handleFilterDate={handleFilterDate}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusLabels={statusLabels}
        />

        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={<FiCalendar />}
            title="No hay citas"
            description="Las citas de tus clientes aparecerán aquí"
          />
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentsCard
                key={appointment.id}
                appointment={appointment}
                showNotesFor={showNotesFor}
                setShowNotesFor={setShowNotesFor}
                adminNotes={adminNotes}
                setAdminNotes={setAdminNotes}
                handleUpdateStatus={handleUpdateStatus}
                updating={updating}
                statusLabels={statusLabels}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AppointmentAdmin;
