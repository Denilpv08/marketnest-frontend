import { FiCalendar, FiX } from "react-icons/fi";

interface AppointmentFiltersProps {
  filterDate: string;
  handleFilterDate: (date: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  statusLabels: Record<string, string>;
}

const AppointmentFilters = ({
  filterDate,
  handleFilterDate,
  filterStatus,
  setFilterStatus,
  statusLabels,
}: AppointmentFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative">
        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => handleFilterDate(e.target.value)}
          className="pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        <option value="all">Todos los estados</option>
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {filterDate && (
        <button
          onClick={() => handleFilterDate("")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          <FiX />
          Limpiar fecha
        </button>
      )}
    </div>
  );
};

export default AppointmentFilters;
