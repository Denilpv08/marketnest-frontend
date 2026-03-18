import { Service, ServiceForm } from "@/types";
import { FiSave, FiX } from "react-icons/fi";

interface ServicesModalProps {
  editingService: Service | null;
  setShowServiceModal: (show: boolean) => void;
  handleServiceSubmit: (e: React.FormEvent) => void;
  serviceForm: ServiceForm;
  setServiceForm: (form: ServiceForm) => void;
  categories: { id: number; name: string }[];
  saving: boolean;
}

const ServicesModal = ({
  editingService,
  setShowServiceModal,
  handleServiceSubmit,
  serviceForm,
  setServiceForm,
  categories,
  saving,
}: ServicesModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900 text-lg">
            {editingService ? "Editar servicio" : "Nuevo servicio"}
          </h2>
          <button
            onClick={() => setShowServiceModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  description: e.target.value,
                })
              }
              rows={2}
              className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                value={serviceForm.price}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, price: e.target.value })
                }
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={serviceForm.category_id}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    category_id: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración
              </label>
              <input
                type="number"
                value={serviceForm.duration}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    duration: e.target.value,
                  })
                }
                required
                min="1"
                className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad
              </label>
              <select
                value={serviceForm.duration_unit}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    duration_unit: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="minutes">Minutos</option>
                <option value="hours">Horas</option>
                <option value="days">Días</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen
            </label>
            <input
              type="text"
              value={serviceForm.image_url}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  image_url: e.target.value,
                })
              }
              placeholder="https://..."
              className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          {editingService && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={serviceForm.is_active}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    is_active: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Servicio activo</span>
            </label>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowServiceModal(false)}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesModal;
