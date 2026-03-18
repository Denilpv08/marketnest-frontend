import Card from "@/components/ui/Card";

type StoreTimeFormData = {
  allows_appointments: boolean;
  opening_hours: Record<string, { open: string; close: string } | null>;
};

interface StoreTimeProps<T extends StoreTimeFormData> {
  formData: T;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
}

const days = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const StoreTime = <T extends StoreTimeFormData>({
  formData,
  handleChange,
  setFormData,
}: StoreTimeProps<T>) => {
  const handleScheduleChange = (
    day: string,
    field: "open" | "close",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...(prev.opening_hours[day] || { open: "08:00", close: "18:00" }),
          [field]: value,
        },
      },
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const current = prev.opening_hours[day];
      return {
        ...prev,
        opening_hours: {
          ...prev.opening_hours,
          [day]: current ? null : { open: "08:00", close: "18:00" },
        },
      };
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Citas y horarios</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="allows_appointments"
            checked={formData.allows_appointments}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Permitir agendar citas</span>
        </label>
      </div>

      <div className="space-y-3">
        {days.map(({ key, label }) => {
          const hours = formData.opening_hours[key];
          const isOpen = hours !== null && hours !== undefined;
          return (
            <div key={key} className="flex items-center gap-4">
              <label className="flex items-center gap-2 w-32 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={() => toggleDay(key)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
              {isOpen && hours ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) =>
                      handleScheduleChange(key, "open", e.target.value)
                    }
                    className="px-3 py-1.5 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400 text-sm">—</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) =>
                      handleScheduleChange(key, "close", e.target.value)
                    }
                    className="px-3 py-1.5 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Cerrado</span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StoreTime;
