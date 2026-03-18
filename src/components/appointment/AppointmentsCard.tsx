import { Appointment, AppointmentStatus } from "@/types";
import Badge from "../ui/Badge";
import { FiCalendar, FiClock, FiX } from "react-icons/fi";

interface AppointmentsCardProps {
  appointment: Appointment;
  handleCancel: (id: number) => void;
}

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

const AppointmentsCard = ({
  appointment,
  handleCancel,
}: AppointmentsCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
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
  );
};

export default AppointmentsCard;
