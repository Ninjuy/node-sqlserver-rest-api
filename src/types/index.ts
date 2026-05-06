import type { Request } from "express";

export interface AuthPayload {
  userId: number;
  email: string;
  role: "admin" | "user";
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { page: number; limit: number; total: number };
}
