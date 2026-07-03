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
  startDate: string;
  officeDays: string; // e.g. "Mon,Wed,Thu"
  buddyId?: number | null;
  buddy?: Employee | null;
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
