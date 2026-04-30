import type { Item, CreateItemPayload, UpdateItemPayload } from '../types/item.types';
import { apiClient, type ApiResponse } from '../../../services/api';

export interface ImageUploadResponse {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
}

class ItemService {
  private readonly endpoint = '/items';

  async getAllItems(): Promise<Item[]> {
    const response = await apiClient.get<ApiResponse<Item[]>>(this.endpoint);
    return response.data;
  }

  async getItemById(id: number): Promise<Item> {
    const response = await apiClient.get<ApiResponse<Item>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async createItem(payload: CreateItemPayload): Promise<Item> {
    const response = await apiClient.post<ApiResponse<Item>>(this.endpoint, payload);
    return response.data;
  }

  async updateItem(id: number, payload: UpdateItemPayload): Promise<Item> {
    const response = await apiClient.put<ApiResponse<Item>>(
      `${this.endpoint}/${id}`,
      payload
    );
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Upload a single image for an item
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1'}/items/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload image');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Upload multiple images for an item
   */
  async uploadImages(files: File[]): Promise<ImageUploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1'}/items/upload-images`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload images');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Delete an image file from the server
   */
  async deleteImage(imageUrl: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1'}/items/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Delete failed' }));
      throw new Error(error.message || 'Failed to delete image');
    }
  }
}

export const itemService = new ItemService();
