import Badge from "@/components/ui/Badge";
import { Appointment, AppointmentStatus } from "@/types";
import { FiCalendar, FiCheck, FiClock, FiFilter, FiX } from "react-icons/fi";

interface AppointmentsCardProps {
  appointment: Appointment;
  showNotesFor: number | null;
  setShowNotesFor: (id: number | null) => void;
  adminNotes: Record<number, string>;
  setAdminNotes: (notes: Record<number, string>) => void;
  handleUpdateStatus: (id: number, status: AppointmentStatus) => void;
  updating: number | null;
  statusLabels: Record<AppointmentStatus, string>;
}

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
  showNotesFor,
  setShowNotesFor,
  adminNotes,
  setAdminNotes,
  handleUpdateStatus,
  updating,
  statusLabels,
}: AppointmentsCardProps) => {
  return (
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
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {appointment.service.category.name}
            </span>
          )}
        </div>
        <Badge
          text={statusLabels[appointment.status]}
          variant={statusVariants[appointment.status]}
        />
      </div>

      {/* Fecha y hora */}
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
        {appointment.service && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-blue-600">
              ${appointment.service.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Notas del cliente */}
      {appointment.notes && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3 text-sm text-gray-600">
          <span className="font-medium">Cliente: </span>
          {appointment.notes}
        </div>
      )}

      {/* Notas del admin */}
      {appointment.admin_notes && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3 text-sm text-blue-600">
          <span className="font-medium">Tu nota: </span>
          {appointment.admin_notes}
        </div>
      )}

      {/* Input notas */}
      {showNotesFor === appointment.id && (
        <div className="mb-3">
          <textarea
            value={adminNotes[appointment.id] || ""}
            onChange={(e) =>
              setAdminNotes({
                ...adminNotes,
                [appointment.id]: e.target.value,
              })
            }
            placeholder="Agregar nota interna (opcional)..."
            rows={2}
            className="w-full px-3 py-2 border  text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      )}

      {/* Acciones */}
      {(appointment.status === AppointmentStatus.pending ||
        appointment.status === AppointmentStatus.confirmed) && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50">
          {appointment.status === AppointmentStatus.pending && (
            <button
              onClick={() => {
                setShowNotesFor(
                  showNotesFor === appointment.id ? null : appointment.id,
                );
              }}
              className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <FiFilter />
              {showNotesFor === appointment.id
                ? "Ocultar notas"
                : "Agregar nota"}
            </button>
          )}

          {appointment.status === AppointmentStatus.pending && (
            <button
              onClick={() =>
                handleUpdateStatus(appointment.id, AppointmentStatus.confirmed)
              }
              disabled={updating === appointment.id}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              {updating === appointment.id ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck />
              )}
              Confirmar
            </button>
          )}

          {appointment.status === AppointmentStatus.confirmed && (
            <button
              onClick={() =>
                handleUpdateStatus(appointment.id, AppointmentStatus.completed)
              }
              disabled={updating === appointment.id}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              {updating === appointment.id ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck />
              )}
              Completar
            </button>
          )}

          <button
            onClick={() =>
              handleUpdateStatus(appointment.id, AppointmentStatus.cancelled)
            }
            disabled={updating === appointment.id}
            className="flex items-center gap-1.5 border border-red-100 hover:bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <FiX />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsCard;
