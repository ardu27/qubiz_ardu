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

export interface DeskReservation {
  id: number;
  employeeId: number;
  employeeName: string;
  reservationDate: string;
  deskNumber: number;
}

export const getBookingsByDate = async (dateStr: string): Promise<DeskReservation[]> => {
  const response = await apiClient.get<DeskReservation[]>(`/bookings/date/${dateStr}`);
  return response.data;
};

export const createBooking = async (
  employeeId: number,
  employeeName: string,
  dateStr: string,
  deskNumber: number
): Promise<DeskReservation> => {
  const response = await apiClient.post<DeskReservation>("/bookings", {
    employeeId,
    employeeName,
    reservationDate: dateStr,
    deskNumber
  });
  return response.data;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await apiClient.delete(`/bookings/${id}`);
};
