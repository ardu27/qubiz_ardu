import apiClient from "../../shared/lib/apiClient";
import type { Employee, Department } from "../../shared/types";

export const getAllEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get<Employee[]>("/employees");
  return response.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await apiClient.get<Department[]>("/departments");
  return response.data;
};
