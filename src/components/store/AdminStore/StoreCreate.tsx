import AdminLayout from "@/components/layout/AdminLayout";
import Card from "@/components/ui/Card";
import { storesApi } from "@/lib/api";
import toast from "react-hot-toast";

interface StoreCreateProps {
  saving: boolean;
  setSaving: (saving: boolean) => void;
  setStore: (store: any) => void;
  setShowCreateForm: (show: boolean) => void;
  formData: {
    name: string;
    slug: string;
    description?: string;
    store_type?: string;
    business_type: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  storeTypeOptions: { value: string; label: string }[];
  businessTypeOptions: { value: string; label: string }[];
}

const StoreCreate = ({
  saving,
  setSaving,
  setStore,
  setShowCreateForm,
  formData,
  handleChange,
  storeTypeOptions,
  businessTypeOptions,
}: StoreCreateProps) => {
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newStore = await storesApi.create({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        store_type: formData.store_type || undefined,
        business_type: formData.business_type,
      });
      setStore(newStore);
      setShowCreateForm(false);
      toast.success("Tienda creada — pendiente de aprobación");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al crear la tienda");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Crear mi tienda
        </h1>
        <Card>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la tienda
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
                Slug (URL de tu tienda)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="mi-tienda"
                required
                className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="text-gray-400 text-xs mt-1">
                Solo letras minúsculas, números y guiones
              </p>
            </div>
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
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Crear tienda"
              )}
            </button>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default StoreCreate;
