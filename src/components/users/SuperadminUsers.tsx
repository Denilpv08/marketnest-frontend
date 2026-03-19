"use client";
import { useState, useEffect } from "react";
import SuperadminLayout from "@/components/layout/superadmin/SuperadminLayout";
import { User, UserRole, UserStatus } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiCheck,
  FiX,
  FiSlash,
} from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import Link from "next/link";
import api from "@/lib/axios";
import toast from "react-hot-toast";

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

const statusLabels: Record<UserStatus, string> = {
  active: "Activo",
  pending: "Pendiente",
  suspended: "Suspendido",
};

const statusVariants: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  pending: "warning",
  suspended: "danger",
};

const SuperadminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, filterRole, filterStatus, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/admin/users");
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
    if (filterStatus !== "all") {
      result = result.filter((u) => u.status === filterStatus);
    }
    setFiltered(result);
  };

  const handleStatusChange = async (userId: number, status: UserStatus) => {
    setUpdating(userId);
    try {
      await api.patch(`/api/admin/users/${userId}/status`, { status });
      toast.success(
        status === UserStatus.active
          ? "Usuario aprobado"
          : status === UserStatus.suspended
            ? "Usuario suspendido"
            : "Estado actualizado",
      );
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al actualizar");
    } finally {
      setUpdating(null);
    }
  };

  const pendingCount = users.filter(
    (u) => u.status === UserStatus.pending,
  ).length;

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-500 text-sm mt-1">
              {users.length} usuario{users.length !== 1 ? "s" : ""} registrados
              {pendingCount > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <Link
            href="/superadmin/users/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            <FiPlus />
            Crear admin
          </Link>
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
            className="px-4 py-2.5 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="all">Todos los roles</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
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
          <div className="space-y-3">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
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

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.name} {user.last_name}
                      </p>
                      <Badge
                        text={roleLabels[user.role]}
                        variant={roleVariants[user.role]}
                      />
                      <Badge
                        text={statusLabels[user.status]}
                        variant={statusVariants[user.status]}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FiMail className="shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.city && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <FiMapPin className="shrink-0" />
                          <span>{user.city}</span>
                        </div>
                      )}
                      {user.identity_number && (
                        <div className="text-gray-500 text-xs">
                          {user.identity_type?.toUpperCase()}:{" "}
                          {user.identity_number}
                        </div>
                      )}
                      <div className="text-gray-400 text-xs">
                        Registrado:{" "}
                        {new Date(user.created_at).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {user.role !== UserRole.superadmin && (
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Editar */}
                      <Link
                        href={`/superadmin/users/${user.id}/edit`}
                        className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <FiEdit2 />
                        Editar
                      </Link>

                      {/* Aprobar */}
                      {user.status === UserStatus.pending && (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, UserStatus.active)
                          }
                          disabled={updating === user.id}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          {updating === user.id ? (
                            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiCheck />
                          )}
                          Aprobar
                        </button>
                      )}

                      {/* Reactivar */}
                      {user.status === UserStatus.suspended && (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, UserStatus.active)
                          }
                          disabled={updating === user.id}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          {updating === user.id ? (
                            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiCheck />
                          )}
                          Reactivar
                        </button>
                      )}

                      {/* Suspender */}
                      {user.status === UserStatus.active && (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, UserStatus.suspended)
                          }
                          disabled={updating === user.id}
                          className="flex items-center gap-1.5 border border-red-100 hover:bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          {updating === user.id ? (
                            <div className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiSlash />
                          )}
                          Suspender
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SuperadminLayout>
  );
};

export default SuperadminUsers;
