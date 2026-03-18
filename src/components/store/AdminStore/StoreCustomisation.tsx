import Card from "@/components/ui/Card";

interface StoreCustomisationProps {
  formData: {
    primary_color: string;
    secondary_color: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StoreCustomisation = ({
  formData,
  handleChange,
}: StoreCustomisationProps) => {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900 mb-4">Personalización</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color primario
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="primary_color"
              value={formData.primary_color}
              onChange={handleChange}
              className="h-10 w-16 rounded-lg border text-black border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              {formData.primary_color}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color secundario
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="secondary_color"
              value={formData.secondary_color}
              onChange={handleChange}
              className="h-10 w-16 rounded-lg border text-black border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              {formData.secondary_color}
            </span>
          </div>
        </div>
      </div>

      {/* Preview colores */}
      <div
        className="mt-4 h-16 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${formData.primary_color}, ${formData.secondary_color})`,
        }}
      />
    </Card>
  );
};

export default StoreCustomisation;
