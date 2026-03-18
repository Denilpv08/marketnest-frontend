import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { Service } from "@/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdMiscellaneousServices } from "react-icons/md";

interface ServicesCardProps {
  services: Service[];
  openCreateService: () => void;
  openEditService: (service: Service) => void;
  handleDeleteService: (service: Service) => void;
}

const ServicesCard = ({
  services,
  openCreateService,
  openEditService,
  handleDeleteService,
}: ServicesCardProps) => {
  return (
    <>
      {services.length === 0 ? (
        <EmptyState
          icon={<MdMiscellaneousServices />}
          title="No tienes servicios aún"
          description="Crea tus primeros servicios para ofrecerlos a tus clientes"
          action={
            <button
              onClick={openCreateService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Crear servicio
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <Card key={service.id} padding="sm">
              <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MdMiscellaneousServices className="text-gray-300 text-4xl" />
                )}
              </div>
              <div className="px-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {service.name}
                  </h3>
                  <Badge
                    text={service.is_active ? "Activo" : "Inactivo"}
                    variant={service.is_active ? "success" : "gray"}
                  />
                </div>
                {service.category && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {service.category.name}
                  </span>
                )}
                <p className="text-blue-600 font-bold mt-2">
                  ${service.price.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">
                  {service.duration} {service.duration_unit}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEditService(service)}
                    className="flex-1 flex items-center justify-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <FiEdit2 />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteService(service)}
                    className="flex items-center justify-center border border-red-100 hover:bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ServicesCard;
