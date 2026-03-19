"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";
import SuperadminSidebar from "./SuperadminSidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface SuperadminLayoutProps {
  children: React.ReactNode;
}

const SuperadminLayout = ({ children }: SuperadminLayoutProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (user?.role !== UserRole.superadmin) {
      router.push("/");
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SuperadminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default SuperadminLayout;
