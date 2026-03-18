"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { storesApi, servicesApi } from "@/lib/api";
import { CategoryForm, Service, ServiceCategory, ServiceForm } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import ServicesHeader from "./AdminServices/ServicesHeader";
import ServicesCard from "./AdminServices/ServicesCard";
import CategoriesCard from "./AdminServices/CategoriesCard";
import ServicesModal from "./AdminServices/ServicesModal";
import CategoriesModal from "./AdminServices/CategoriesModal";

const emptyServiceForm: ServiceForm = {
  name: "",
  description: "",
  price: "",
  duration: "",
  duration_unit: "minutes",
  category_id: "",
  image_url: "",
  is_active: true,
};

const emptyCategoryForm: CategoryForm = {
  name: "",
  description: "",
};

const ServicesAdmin = () => {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "categories">(
    "services",
  );

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);

  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [categoryForm, setCategoryForm] =
    useState<CategoryForm>(emptyCategoryForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stores = await storesApi.getMyStores();
      if (stores.length > 0) {
        setStoreId(stores[0].id);
        const [servicesData, categoriesData] = await Promise.all([
          servicesApi.getByStore(stores[0].id),
          servicesApi.getCategories(stores[0].id),
        ]);
        setServices(servicesData);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateService = () => {
    setEditingService(null);
    setServiceForm(emptyServiceForm);
    setShowServiceModal(true);
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration.toString(),
      duration_unit: service.duration_unit,
      category_id: service.category_id?.toString() || "",
      image_url: service.image_url || "",
      is_active: service.is_active,
    });
    setShowServiceModal(true);
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setShowCategoryModal(true);
  };

  const openEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
    setShowCategoryModal(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setSaving(true);
    try {
      const payload = {
        name: serviceForm.name,
        description: serviceForm.description || undefined,
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration),
        duration_unit: serviceForm.duration_unit,
        category_id: serviceForm.category_id
          ? parseInt(serviceForm.category_id)
          : undefined,
        image_url: serviceForm.image_url || undefined,
        is_active: serviceForm.is_active,
      };

      if (editingService) {
        await servicesApi.update(editingService.id, payload);
        toast.success("Servicio actualizado");
      } else {
        await servicesApi.create(storeId, payload);
        toast.success("Servicio creado");
      }

      setShowServiceModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setSaving(true);
    try {
      if (editingCategory) {
        await servicesApi.updateCategory(editingCategory.id, categoryForm);
        toast.success("Categoría actualizada");
      } else {
        await servicesApi.createCategory(storeId, categoryForm);
        toast.success("Categoría creada");
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!confirm(`¿Desactivar "${service.name}"?`)) return;
    try {
      await servicesApi.delete(service.id);
      toast.success("Servicio desactivado");
      fetchData();
    } catch {
      toast.error("Error al desactivar");
    }
  };

  const handleDeleteCategory = async (category: ServiceCategory) => {
    if (!confirm(`¿Desactivar categoría "${category.name}"?`)) return;
    try {
      await servicesApi.deleteCategory(category.id);
      toast.success("Categoría desactivada");
      fetchData();
    } catch {
      toast.error("Error al desactivar");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <ServicesHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          services={services}
          categories={categories}
          openCreateService={openCreateService}
          openCreateCategory={openCreateCategory}
        />

        {/* Servicios */}
        {activeTab === "services" && (
          <ServicesCard
            services={services}
            openCreateService={openCreateService}
            openEditService={openEditService}
            handleDeleteService={handleDeleteService}
          />
        )}

        {/* Categorías */}
        {activeTab === "categories" && (
          <CategoriesCard
            categories={categories}
            openCreateCategory={openCreateCategory}
            openEditCategory={openEditCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        )}
      </div>

      {/* Modal servicio */}
      {showServiceModal && (
        <ServicesModal
          categories={categories}
          editingService={editingService}
          handleServiceSubmit={handleServiceSubmit}
          saving={saving}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          setShowServiceModal={setShowServiceModal}
        />
      )}

      {/* Modal categoría */}
      {showCategoryModal && (
        <CategoriesModal
          editingCategory={editingCategory}
          setShowCategoryModal={setShowCategoryModal}
          handleCategorySubmit={handleCategorySubmit}
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
};

export default ServicesAdmin;
