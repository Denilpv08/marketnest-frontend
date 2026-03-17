"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  MdStorefront,
  MdDashboard,
  MdInventory,
  MdMiscellaneousServices,
} from "react-icons/md";
import { FiShoppingBag, FiCalendar, FiLogOut, FiUser } from "react-icons/fi";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/admin/store", label: "Mi tienda", icon: MdStorefront },
  { href: "/admin/products", label: "Productos", icon: MdInventory },
  {
    href: "/admin/services",
    label: "Servicios",
    icon: MdMiscellaneousServices,
  },
  { href: "/admin/orders", label: "Órdenes", icon: FiShoppingBag },
  { href: "/admin/appointments", label: "Citas", icon: FiCalendar },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MdStorefront className="text-blue-400 text-2xl" />
          <span className="text-white font-bold text-lg">MarketNest</span>
        </div>
        <p className="text-gray-400 text-xs mt-1">Panel de administración</p>
      </div>

      {/* Usuario */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="text-lg shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm"
        >
          <FiUser className="text-lg" />
          Ver sitio
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors text-sm"
        >
          <FiLogOut className="text-lg" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
