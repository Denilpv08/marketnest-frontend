"use client";
import { useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState } from "react";
import CartCards from "./CartCards";

const Cart = () => {
  const { fetchCart } = useCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchCart().finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi carrito</h1>
        <CartCards />
      </div>
    </PublicLayout>
  );
};

export default Cart;
