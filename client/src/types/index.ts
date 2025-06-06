// Common types for the application

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  specifications?: Record<string, string>;
}

// Work/Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  client: string;
  completionDate: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Social media types
export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin';
  url: string;
  icon: string;
} 