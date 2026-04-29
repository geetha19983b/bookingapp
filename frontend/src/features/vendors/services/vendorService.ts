import type { Vendor, CreateVendorPayload, UpdateVendorPayload } from '../types/vendor.types';
import { apiClient, type ApiResponse } from '../../../services/api';

class VendorService {
  private readonly endpoint = '/vendors';

  async getAllVendors(): Promise<Vendor[]> {
    const response = await apiClient.get<ApiResponse<Vendor[]>>(this.endpoint);
    return response.data;
  }

  async getVendorById(id: number): Promise<Vendor> {
    const response = await apiClient.get<ApiResponse<Vendor>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async createVendor(payload: CreateVendorPayload): Promise<Vendor> {
    const response = await apiClient.post<ApiResponse<Vendor>>(this.endpoint, payload);
    return response.data;
  }

  async updateVendor(id: number, payload: UpdateVendorPayload): Promise<Vendor> {
    const response = await apiClient.put<ApiResponse<Vendor>>(
      `${this.endpoint}/${id}`,
      payload
    );
    return response.data;
  }

  async deleteVendor(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const vendorService = new VendorService();
