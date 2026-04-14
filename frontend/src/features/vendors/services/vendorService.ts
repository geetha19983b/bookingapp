import type { Vendor, CreateVendorPayload, UpdateVendorPayload } from '../types/vendor.types';

const API_BASE_URL = 'http://localhost:5174/api';

export interface ApiError {
  message: string;
  errors?: Array<{ path: string; message: string }>;
  detail?: string;
}

class VendorService {
  private baseUrl = `${API_BASE_URL}/vendors`;

  async getAllVendors(): Promise<Vendor[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to fetch vendors');
    }
    const result = await response.json();
    // Return only the data array
    return result.data;
  }

  async getVendorById(id: number): Promise<Vendor> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to fetch vendor');
    }
     const result = await response.json();
     return result.data; ;
  }

  async createVendor(payload: CreateVendorPayload): Promise<Vendor> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error;
    }
    return response.json();
  }

  async updateVendor(id: number, payload: UpdateVendorPayload): Promise<Vendor> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error;
    }
    return response.json();
  }

  async deleteVendor(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to delete vendor');
    }
  }
}

export const vendorService = new VendorService();
