import { ContactFormData, ApiResponse, Service, Product } from '../types';
import { getApiUrl } from './env';

const API_URL = getApiUrl();

export const submitContactForm = async (
    formData: ContactFormData,
): Promise<ApiResponse<{ message: string }>> => {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        const data = await response.json();
        return {
            data,
            status: 'success',
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            data: { message: 'Failed to submit form' },
            status: 'error',
            message: error instanceof Error ? error.message : 'An unknown error occurred',
        };
    }
};

export const getServices = async (): Promise<ApiResponse<Service[]>> => {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        return {
            data,
            status: 'success',
        };
    } catch (error) {
        return {
            data: [],
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to fetch services',
        };
    }
};

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return {
            data,
            status: 'success',
        };
    } catch (error) {
        return {
            data: [],
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to fetch products',
        };
    }
};