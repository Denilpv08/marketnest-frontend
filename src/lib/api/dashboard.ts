import api from "@/lib/axios";
import { DashboardStore, DashboardSuperadmin } from "@/types";

export const dashboardApi = {
  getStoreDashboard: async (storeId: number): Promise<DashboardStore> => {
    const response = await api.get(`/api/dashboard/store/${storeId}`);
    return response.data;
  },

  getSuperadminDashboard: async (): Promise<DashboardSuperadmin> => {
    const response = await api.get("/api/dashboard/superadmin");
    return response.data;
  },
};
