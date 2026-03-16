import api from "@/lib/axios";
import { Appointment } from "@/types";

interface CreateAppointmentData {
  store_id: number;
  service_id?: number;
  date: string;
  time: string;
  notes?: string;
}

interface UpdateAppointmentData {
  date?: string;
  time?: string;
  notes?: string;
}

export const appointmentsApi = {
  create: async (data: CreateAppointmentData): Promise<Appointment> => {
    const response = await api.post("/api/appointments/", data);
    return response.data;
  },

  getMyAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get("/api/appointments/my");
    return response.data;
  },

  getByStore: async (
    storeId: number,
    date?: string,
  ): Promise<Appointment[]> => {
    const params = date ? { appointment_date: date } : {};
    const response = await api.get(`/api/appointments/store/${storeId}`, {
      params,
    });
    return response.data;
  },

  getById: async (appointmentId: number): Promise<Appointment> => {
    const response = await api.get(`/api/appointments/${appointmentId}`);
    return response.data;
  },

  update: async (
    appointmentId: number,
    data: UpdateAppointmentData,
  ): Promise<Appointment> => {
    const response = await api.put(`/api/appointments/${appointmentId}`, data);
    return response.data;
  },

  updateStatus: async (
    appointmentId: number,
    status: string,
    admin_notes?: string,
  ): Promise<Appointment> => {
    const response = await api.patch(
      `/api/appointments/${appointmentId}/status`,
      { status, admin_notes },
    );
    return response.data;
  },

  cancel: async (appointmentId: number): Promise<void> => {
    await api.delete(`/api/appointments/${appointmentId}`);
  },
};
