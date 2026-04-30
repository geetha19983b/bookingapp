// Account type definitions based on backend schema

export interface Account {
  id: number;
  accountName: string;
  accountCode?: string | null;
  accountType: string;
  description?: string | null;
  parentAccountId?: number | null;
  depth?: number;
  isRootAccountWithChild?: boolean;
  isTaxAccount?: boolean;
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountOption {
  id: number;
  accountName: string;
  accountCode?: string | null;
  accountType: string;
  depth?: number;
  parentAccountId?: number | null;
  isTaxAccount?: boolean;
  isRootAccountWithChild?: boolean;
}
