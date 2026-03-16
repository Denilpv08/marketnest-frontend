"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { UserRole } from "@/types";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (user?.role === UserRole.superadmin) return "/superadmin/dashboard";
    if (user?.role === UserRole.admin) return "/admin/dashboard";
    return "/orders";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <MdStorefront className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-gray-900">MarketNest</span>
          </Link>

          {/* Links escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/stores"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Tiendas
            </Link>
            {isAuthenticated && user?.role === UserRole.admin && (
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Mi tienda
              </Link>
            )}
            {isAuthenticated && user?.role === UserRole.superadmin && (
              <Link
                href="/superadmin/dashboard"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Panel admin
              </Link>
            )}
          </div>

          {/* Acciones escritorio */}
          <div className="hidden md:flex items-center gap-4">
            {/* Carrito */}
            {isAuthenticated && user?.role === UserRole.customer && (
              <Link href="/cart" className="relative">
                <FiShoppingCart className="text-gray-600 hover:text-blue-600 text-xl transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Usuario autenticado */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {user?.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-medium">{user?.name}</span>
                </button>

                {/* Dropdown usuario */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser />
                      Mi perfil
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm w-full"
                    >
                      <FiLogOut />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/stores"
            className="block text-gray-700 font-medium py-2"
            onClick={() => setMenuOpen(false)}
          >
            Tiendas
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href={getDashboardLink()}
                className="block text-gray-700 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                Mi perfil
              </Link>
              {user?.role === UserRole.customer && (
                <Link
                  href="/cart"
                  className="block text-gray-700 font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Carrito {itemCount > 0 && `(${itemCount})`}
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block text-red-600 font-medium py-2 w-full text-left"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-gray-700 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className="block text-blue-600 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
