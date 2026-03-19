"use client";
import { useState } from "react";
import SuperadminLayout from "@/components/layout/superadmin/SuperadminLayout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiSave,
  FiMapPin,
} from "react-icons/fi";
import Link from "next/link";
import api from "@/lib/axios";

const CreateAdmin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    identity_type: "",
    identity_number: "",
    city: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/admin/users", {
        name: formData.name,
        last_name: formData.last_name || undefined,
        email: formData.email,
        password: formData.password,
        role: "admin",
        identity_type: formData.identity_type || undefined,
        identity_number: formData.identity_number || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
      });
      toast.success("Usuario admin creado exitosamente");
      router.push("/superadmin/users");
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Error al crear el usuario";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SuperadminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/superadmin/users"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Crear usuario admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              El usuario quedará activo y podrá iniciar sesión de inmediato
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-sm text-blue-700">
          <p className="font-medium mb-1">ℹ️ Creación directa por superadmin</p>
          <p>
            A diferencia del registro público, este usuario admin quedará
            <strong> aprobado automáticamente</strong> y podrá crear su tienda
            de inmediato.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre y apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan"
                    required
                    className="w-full pl-9 pr-3 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className="w-full px-3 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@tienda.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Tipo y número de identidad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de identidad
                </label>
                <select
                  name="identity_type"
                  value={formData.identity_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="cc">Cédula de ciudadanía</option>
                  <option value="ce">Cédula de extranjería</option>
                  <option value="passport">Pasaporte</option>
                  <option value="nit">NIT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de identidad
                </label>
                <input
                  type="text"
                  name="identity_number"
                  value={formData.identity_number}
                  onChange={handleChange}
                  placeholder="123456789"
                  className="w-full px-3 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Ciudad y dirección */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Santa Marta"
                    className="w-full pl-9 pr-3 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle 10 # 5-20"
                  className="w-full px-3 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <Link
                href="/superadmin/users"
                className="flex-1 text-center border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave />
                    Crear usuario admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SuperadminLayout>
  );
};

export default CreateAdmin;
