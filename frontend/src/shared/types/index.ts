export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  departmentId: number;
  department?: Department;
  departmentName?: string; // populated from flat DTO response
  startDate: string;
  officeDays: string; // e.g. "Mon,Wed,Thu"
  buddyId?: number | null;
  buddy?: Employee | null;
  buddyName?: string | null; // populated from flat DTO response
}

export type TaskCategory = 'FirstDay' | 'FirstWeek' | 'FirstMonth';

export interface OnboardingTask {
  id: number;
  title: string;
  description: string;
  phaseOffsetDays: number;
  category: TaskCategory;
}

export interface EmployeeTaskProgress {
  id: number;
  employeeId: number;
  onboardingTaskId: number;
  onboardingTask?: OnboardingTask;
  isCompleted: boolean;
  completedAt?: string | null;
}

export interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
}

export interface SlackChannel {
  id: number;
  name: string;
  description: string;
  isRequired: boolean;
}

export interface DashboardEmployee {
  id: number;
  fullName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  startDate: string;
  officeDays: string;
  buddyId?: number | null;
  buddyName?: string | null;
}

export interface DashboardTask {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string; // "completed" | "current" | "upcoming"
  phaseOffsetDays: number;
  employeeTaskProgressId?: number | null;
}

export interface DashboardSummary {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface DashboardResponse {
  employee: DashboardEmployee;
  tasks: DashboardTask[];
  summary: DashboardSummary;
  warning?: string | null;
  errorDetails?: string | null;
}
