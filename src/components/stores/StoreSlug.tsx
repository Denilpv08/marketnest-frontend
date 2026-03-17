"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { storesApi, productsApi, servicesApi } from "@/lib/api";
import { Store, Product, Service, BusinessType } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCart } from "@/hooks/useCart";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiShoppingCart,
  FiCalendar,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import Link from "next/link";

const StoreSlug = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products",
  );

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const storeData = await storesApi.getBySlug(slug as string);
      setStore(storeData);

      if (
        storeData.business_type === BusinessType.products ||
        storeData.business_type === BusinessType.products_services
      ) {
        const productsData = await productsApi.getByStore(storeData.id);
        setProducts(productsData);
      }

      if (
        storeData.business_type === BusinessType.services ||
        storeData.business_type === BusinessType.products_services
      ) {
        const servicesData = await servicesApi.getByStore(storeData.id);
        setServices(servicesData);
        if (storeData.business_type === BusinessType.services) {
          setActiveTab("services");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const days: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (!store) {
    return (
      <PublicLayout>
        <div className="py-20 text-center text-gray-500">
          Tienda no encontrada
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Banner */}
      <div
        className="h-48 md:h-64 w-full relative"
        style={{
          background: store.banner_url
            ? `url(${store.banner_url}) center/cover`
            : `linear-gradient(135deg, ${store.primary_color}, ${store.secondary_color})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Info de la tienda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 -mt-10 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* Logo */}
            <div
              className="h-16 w-16 rounded-xl flex items-center justify-center shrink-0 border-2 border-gray-100"
              style={{ background: store.primary_color }}
            >
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <MdStorefront className="text-white text-2xl" />
              )}
            </div>

            {/* Datos */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {store.name}
                  </h1>
                  {store.description && (
                    <p className="text-gray-500 mt-1">{store.description}</p>
                  )}
                </div>

                {/* Botón agendar cita */}
                {store.allows_appointments && (
                  <Link
                    href={`/stores/${store.slug}/appointment`}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    <FiCalendar />
                    Agendar cita
                  </Link>
                )}
              </div>

              {/* Contacto */}
              <div className="flex flex-wrap gap-4 mt-3">
                {store.city && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <FiMapPin />
                    <span>
                      {store.city}
                      {store.address ? `, ${store.address}` : ""}
                    </span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <FiPhone />
                    <span>{store.phone}</span>
                  </div>
                )}
                {store.contact_email && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <FiMail />
                    <span>{store.contact_email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Horarios */}
          {store.opening_hours && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                <FiClock />
                <span>Horarios de atención</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(days).map(([key, label]) => {
                  const hours = store.opening_hours?.[key];
                  return (
                    <div key={key} className="text-sm">
                      <span className="font-medium text-gray-700">
                        {label}:{" "}
                      </span>
                      {hours ? (
                        <span className="text-gray-500">
                          {hours.open} - {hours.close}
                        </span>
                      ) : (
                        <span className="text-red-400">Cerrado</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tabs productos/servicios */}
        {store.business_type === BusinessType.products_services && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-5 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-5 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors ${
                activeTab === "services"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Servicios
            </button>
          </div>
        )}

        {/* Productos */}
        {activeTab === "products" &&
          store.business_type !== BusinessType.services && (
            <div className="mb-12">
              {store.business_type !== BusinessType.products_services && (
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Productos
                </h2>
              )}
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  Esta tienda aún no tiene productos disponibles
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Imagen */}
                      <div className="h-40 bg-gray-100 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiShoppingCart className="text-gray-300 text-4xl" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-blue-600">
                            ${product.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => addToCart(product.id, 1)}
                            disabled={product.stock === 0}
                            className="flex items-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FiShoppingCart className="text-xs" />
                            {product.stock === 0 ? "Agotado" : "Agregar"}
                          </button>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <p className="text-orange-500 text-xs mt-1">
                            ¡Solo quedan {product.stock}!
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Servicios */}
        {activeTab === "services" &&
          store.business_type !== BusinessType.products && (
            <div className="mb-12">
              {store.business_type !== BusinessType.products_services && (
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Servicios
                </h2>
              )}
              {services.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  Esta tienda aún no tiene servicios disponibles
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Imagen */}
                      <div className="h-40 bg-gray-100 flex items-center justify-center">
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiClock className="text-gray-300 text-4xl" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        {service.category && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {service.category.name}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 mt-2 mb-1">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="text-lg font-bold text-blue-600">
                              ${service.price.toLocaleString()}
                            </span>
                            <span className="text-gray-400 text-xs ml-2">
                              {service.duration} {service.duration_unit}
                            </span>
                          </div>
                          {store.allows_appointments && (
                            <Link
                              href={`/stores/${store.slug}/appointment?service=${service.id}`}
                              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <FiCalendar className="text-xs" />
                              Agendar
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>
    </PublicLayout>
  );
};

export default StoreSlug;
