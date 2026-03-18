export interface User {
  id?: string | number;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  id: number | string;
  role: string;
  message?: string;
}

export interface AuthResponseFull extends AuthResponse {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface ApiError {
  message: string;
  details?: any;
}
