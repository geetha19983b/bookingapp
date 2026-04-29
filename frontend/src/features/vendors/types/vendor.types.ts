// Vendor type definitions based on backend schema (camelCase to match Prisma output)

export interface Vendor {
  id: number;
  companyName?: string | null;
  displayName: string;
  email?: string | null;
  workPhone?: string | null;
  mobilePhone?: string | null;
  billingAddressLine1?: string | null;
  billingAddressLine2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingCountry?: string | null;
  billingZipCode?: string | null;
  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingCountry?: string | null;
  shippingZipCode?: string | null;
  gstTreatment?: string | null;
  gstin?: string | null;
  sourceOfSupply?: string | null;
  pan?: string | null;
  isMsmeRegistered?: boolean;
  currency?: string | null;
  openingBalance?: number;
  paymentTerms?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankIfscCode?: string | null;
  bankBranch?: string | null;
  remarks?: string | null;
  customFields?: Record<string, unknown>;
  reportingTags?: string[];
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorPayload {
  displayName: string;
  companyName?: string | null;
  email?: string | null;
  workPhone?: string | null;
  mobilePhone?: string | null;
  billingAddressLine1?: string | null;
  billingAddressLine2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingCountry?: string | null;
  billingZipCode?: string | null;
  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingCountry?: string | null;
  shippingZipCode?: string | null;
  gstTreatment?: string | null;
  gstin?: string | null;
  sourceOfSupply?: string | null;
  pan?: string | null;
  isMsmeRegistered?: boolean;
  currency?: string | null;
  openingBalance?: number;
  paymentTerms?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankIfscCode?: string | null;
  bankBranch?: string | null;
  remarks?: string | null;
  customFields?: Record<string, unknown>;
  reportingTags?: string[];
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface UpdateVendorPayload extends Partial<CreateVendorPayload> {}

export interface VendorFormData extends CreateVendorPayload {}

export interface VendorFilters {
  search?: string;
  isActive?: boolean;
  sourceOfSupply?: string;
}
