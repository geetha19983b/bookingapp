// Item type definitions based on backend schema (camelCase to match Prisma output)

export interface Item {
  id: number;
  
  // Basic Information
  itemType: string;
  name: string;
  sku?: string | null;
  unit?: string | null;
  hsnCode?: string | null;
  
  // Tax Information
  taxPreference?: string;
  intraStateTaxRate?: string | null;
  intraStateTaxPercentage?: number | null;
  interStateTaxRate?: string | null;
  interStateTaxPercentage?: number | null;
  
  // Sales Information
  isSellable?: boolean;
  sellingPrice?: number | null;
  salesAccount?: string | null;
  salesDescription?: string | null;
  
  // Purchase Information
  isPurchasable?: boolean;
  costPrice?: number | null;
  purchaseAccount?: string | null;
  purchaseDescription?: string | null;
  preferredVendorId?: number | null;
  preferredVendor?: {
    id: number;
    displayName: string;
  } | null;
  
  // Inventory Management
  trackInventory?: boolean;
  openingStock?: number;
  openingStockRate?: number;
  reorderLevel?: number | null;
  
  // Images
  imageUrl?: string | null;
  imageUrls?: string[];
  
  // Additional Information
  customFields?: Record<string, unknown> | null;
  tags?: string[];
  
  // Status and Metadata
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CreateItemPayload {
  itemType: string;
  name: string;
  sku?: string | null;
  unit?: string | null;
  hsnCode?: string | null;
  
  // Tax Information
  taxPreference?: string;
  intraStateTaxRate?: string | null;
  intraStateTaxPercentage?: number | null;
  interStateTaxRate?: string | null;
  interStateTaxPercentage?: number | null;
  
  // Sales Information
  isSellable?: boolean;
  sellingPrice?: number | null;
  salesAccount?: string | null;
  salesDescription?: string | null;
  
  // Purchase Information
  isPurchasable?: boolean;
  costPrice?: number | null;
  purchaseAccount?: string | null;
  purchaseDescription?: string | null;
  preferredVendorId?: number | null;
  
  // Inventory Management
  trackInventory?: boolean;
  openingStock?: number;
  openingStockRate?: number;
  reorderLevel?: number | null;
  
  // Images
  imageUrl?: string | null;
  imageUrls?: string[];
  
  // Additional Information
  customFields?: Record<string, unknown> | null;
  tags?: string[];
  
  // Status and Metadata
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface UpdateItemPayload extends Partial<CreateItemPayload> {}

export interface ItemFormData extends CreateItemPayload {}

export interface ItemFilters {
  search?: string;
  itemType?: string;
  isActive?: boolean;
  isSellable?: boolean;
  isPurchasable?: boolean;
}
