"use client";
import { useState, useEffect } from "react";
import SuperadminLayout from "@/components/layout/superadmin/SuperadminLayout";
import { User, UserRole } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { FiSearch, FiUser, FiMail, FiMapPin } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import api from "@/lib/axios";

const roleLabels: Record<UserRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  customer: "Cliente",
};

const roleVariants: Record<UserRole, "danger" | "info" | "gray"> = {
  superadmin: "danger",
  admin: "info",
  customer: "gray",
};

const SuperadminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/");
      setUsers(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = users;
    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.last_name?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterRole !== "all") {
      result = result.filter((u) => u.role === filterRole);
    }
    setFiltered(result);
  };

  if (loading) {
    return (
      <SuperadminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrados
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="all">Todos los roles</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<MdPeople />}
            title="No hay usuarios"
            description="No se encontraron usuarios con esos criterios"
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Usuario
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Contacto
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Ubicación
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Rol
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Registro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Usuario */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          {user.photo_url ? (
                            <img
                              src={user.photo_url}
                              alt={user.name}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <FiUser className="text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {user.name} {user.last_name}
                          </p>
                          {user.identity_number && (
                            <p className="text-gray-400 text-xs">
                              {user.identity_type?.toUpperCase()}:{" "}
                              {user.identity_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <FiMail className="shrink-0 text-xs" />
                        <span className="truncate max-w-45">{user.email}</span>
                      </div>
                    </td>

                    {/* Ubicación */}
                    <td className="px-5 py-4">
                      {user.city ? (
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <FiMapPin className="shrink-0 text-xs" />
                          <span>{user.city}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Rol */}
                    <td className="px-5 py-4">
                      <Badge
                        text={roleLabels[user.role]}
                        variant={roleVariants[user.role]}
                      />
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <Badge
                        text={user.is_active ? "Activo" : "Inactivo"}
                        variant={user.is_active ? "success" : "gray"}
                      />
                    </td>

                    {/* Registro */}
                    <td className="px-5 py-4">
                      <span className="text-gray-500 text-sm">
                        {new Date(user.created_at).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SuperadminLayout>
  );
};

export default SuperadminUsers;
