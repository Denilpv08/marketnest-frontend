"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { storesApi, productsApi } from "@/lib/api";
import { Product, ProductForm } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiX,
  FiSave,
} from "react-icons/fi";
import ProductsCard from "./AdminProducts.tsx/ProductsCard";
import ProductsModal from "./AdminProducts.tsx/ProductsModal";

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  image_url: "",
  is_active: true,
};

const ProductAdmin = () => {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stores = await storesApi.getMyStores();
      if (stores.length > 0) {
        setStoreId(stores[0].id);
        const data = await productsApi.getAllByStore(stores[0].id);
        setProducts(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || "",
      is_active: product.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image_url: form.image_url || undefined,
        is_active: form.is_active,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        toast.success("Producto actualizado");
      } else {
        await productsApi.create(storeId, payload);
        toast.success("Producto creado");
      }

      setShowModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Desactivar "${product.name}"?`)) return;
    try {
      await productsApi.delete(product.id);
      toast.success("Producto desactivado");
      fetchData();
    } catch (error: any) {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} producto{products.length !== 1 ? "s" : ""} en
              total
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            <FiPlus />
            Nuevo producto
          </button>
        </div>

        {/* Lista */}
        <ProductsCard
          products={products}
          openEdit={openEdit}
          openCreate={openCreate}
          handleDelete={handleDelete}
        />
      </div>

      {/* Modal crear/editar */}
      {showModal && (
        <ProductsModal
          editingProduct={editingProduct}
          form={form}
          setForm={setForm}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
};

export default ProductAdmin;
