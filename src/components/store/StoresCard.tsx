import { Store, StoreType } from "@/types";
import Link from "next/link";
import { FiClock, FiMapPin, FiPhone } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

interface StoresCardProps {
  store: Store;
  isOpen: (store: Store) => boolean;
  storeTypeLabels: Record<StoreType, string>;
}

const StoresCard = ({ store, isOpen, storeTypeLabels }: StoresCardProps) => {
  return (
    <Link href={`/stores/${store.slug}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Banner */}
        <div
          className="h-32 relative"
          style={{
            background: store.banner_url
              ? `url(${store.banner_url}) center/cover`
              : `linear-gradient(135deg, ${store.primary_color}, ${store.secondary_color})`,
          }}
        >
          {/* Logo */}
          <div className="absolute -bottom-6 left-4">
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow"
              />
            ) : (
              <div
                className="h-12 w-12 rounded-xl border-2 border-white shadow flex items-center justify-center"
                style={{ background: store.primary_color }}
              >
                <MdStorefront className="text-white text-xl" />
              </div>
            )}
          </div>

          {/* Badge abierto/cerrado */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                isOpen(store)
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isOpen(store) ? "Abierto" : "Cerrado"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-8 pb-4 px-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900">{store.name}</h3>
            {store.store_type && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {store.custom_store_type || storeTypeLabels[store.store_type]}
              </span>
            )}
          </div>

          {store.description && (
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {store.description}
            </p>
          )}

          <div className="space-y-1">
            {store.city && (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <FiMapPin className="shrink-0" />
                <span>{store.city}</span>
              </div>
            )}
            {store.phone && (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <FiPhone className="shrink-0" />
                <span>{store.phone}</span>
              </div>
            )}
            {store.allows_appointments && (
              <div className="flex items-center gap-1.5 text-green-600 text-xs">
                <FiClock className="shrink-0" />
                <span>Acepta citas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoresCard;
