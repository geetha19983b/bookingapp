import type { Unit, CreateUnitPayload, UpdateUnitPayload, ActiveUnit } from '../types/unit.types';
import { apiClient, type ApiResponse } from '../../../services/api';

class UnitService {
  private readonly endpoint = '/units';

  async getActiveUnits(): Promise<ActiveUnit[]> {
    const response = await apiClient.get<ActiveUnit[]>(`${this.endpoint}/active`);
    return response;
  }

  async getAllUnits(): Promise<Unit[]> {
    const response = await apiClient.get<{ data: Unit[] }>(this.endpoint);
    return response.data;
  }

  async getUnitById(id: number): Promise<Unit> {
    const response = await apiClient.get<ApiResponse<Unit>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async createUnit(payload: CreateUnitPayload): Promise<Unit> {
    const response = await apiClient.post<ApiResponse<Unit>>(this.endpoint, payload);
    return response.data;
  }

  async updateUnit(id: number, payload: UpdateUnitPayload): Promise<Unit> {
    const response = await apiClient.put<ApiResponse<Unit>>(
      `${this.endpoint}/${id}`,
      payload
    );
    return response.data;
  }

  async deleteUnit(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const unitService = new UnitService();
