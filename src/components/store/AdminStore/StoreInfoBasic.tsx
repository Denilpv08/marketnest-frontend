import Card from "@/components/ui/Card";
import { MdStorefront } from "react-icons/md";

interface StoreInfoBasicProps {
  formData: {
    name: string;
    description: string;
    store_type: string;
    business_type: string;
    custom_store_type?: string;
    tax_id: string;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  storeTypeOptions: { value: string; label: string }[];
  businessTypeOptions: { value: string; label: string }[];
}

const StoreInfoBasic = ({
  formData,
  handleChange,
  storeTypeOptions,
  businessTypeOptions,
}: StoreInfoBasicProps) => {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MdStorefront />
        Información básica
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de negocio
            </label>
            <select
              name="store_type"
              value={formData.store_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Seleccionar...</option>
              {storeTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Qué ofreces?
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {businessTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {formData.store_type === "other" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especifica el tipo
            </label>
            <input
              type="text"
              name="custom_store_type"
              value={formData.custom_store_type}
              onChange={handleChange}
              placeholder="Ej: Tienda de mascotas"
              className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIT / Identificación tributaria
          </label>
          <input
            type="text"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    </Card>
  );
};

export default StoreInfoBasic;
