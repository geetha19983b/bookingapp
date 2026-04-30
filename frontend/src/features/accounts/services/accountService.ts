import type { AccountOption } from '../types/account.types';
import { apiClient, type ApiResponse } from '../../../services/api';

class AccountService {
  private readonly endpoint = '/accounts';

  /**
   * Get income accounts (for sales dropdown)
   */
  async getIncomeAccounts(): Promise<AccountOption[]> {
    const response = await apiClient.get<ApiResponse<AccountOption[]>>(
      `${this.endpoint}/income`
    );
    return response.data;
  }

  /**
   * Get purchase accounts (for purchase dropdown)
   * Includes expense, cost_of_goods_sold, other_current_asset, other_current_liability
   */
  async getPurchaseAccounts(): Promise<AccountOption[]> {
    const response = await apiClient.get<ApiResponse<AccountOption[]>>(
      `${this.endpoint}/purchase`
    );
    return response.data;
  }
}

export const accountService = new AccountService();
