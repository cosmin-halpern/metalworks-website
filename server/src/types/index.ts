import { Request, Response, NextFunction } from 'express';

// API Response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Middleware types
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Email types
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Environment variables type
export interface EnvVariables {
  PORT: string;
  NODE_ENV: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  CONTACT_EMAIL: string;
} 