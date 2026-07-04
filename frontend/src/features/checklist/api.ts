import apiClient from "../../shared/lib/apiClient";
import type { DashboardTask } from "../../shared/types";

export const getEmployeeTasks = async (employeeId: number, startDate: string): Promise<DashboardTask[]> => {
  const response = await apiClient.get<DashboardTask[]>(`/tasks/employee/${employeeId}`, {
    params: { startDate }
  });
  return response.data;
};

export const completeTask = async (progressId: number): Promise<void> => {
  await apiClient.patch(`/tasks/progress/${progressId}/complete`);
};
