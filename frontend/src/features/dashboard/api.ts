import apiClient from "../../shared/lib/apiClient";
import type { DashboardResponse } from "../../shared/types";

export const getDashboard = async (employeeId: number): Promise<DashboardResponse> => {
  const response = await apiClient.get<DashboardResponse>(`/dashboard/${employeeId}`);
  return response.data;
};
