import { Appointment } from "@/types";

interface ApointmentHeaderProps {
  appointments: Appointment[]; // Cambia 'any' por el tipo específico de tus citas
}

const ApointmentHeader = ({ appointments }: ApointmentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
        <p className="text-gray-500 text-sm mt-1">
          {appointments.length} cita{appointments.length !== 1 ? "s" : ""} en
          total
        </p>
      </div>
    </div>
  );
};

export default ApointmentHeader;
