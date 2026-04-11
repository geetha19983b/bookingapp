// Vendor type definitions based on backend schema

export interface Vendor {
  id: number;
  company_name?: string | null;
  display_name: string;
  email?: string | null;
  work_phone?: string | null;
  mobile_phone?: string | null;
  billing_address_line1?: string | null;
  billing_address_line2?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_country?: string | null;
  billing_zip_code?: string | null;
  shipping_address_line1?: string | null;
  shipping_address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_country?: string | null;
  shipping_zip_code?: string | null;
  gst_treatment?: string | null;
  gstin?: string | null;
  source_of_supply?: string | null;
  pan?: string | null;
  is_msme_registered?: boolean;
  currency?: string | null;
  opening_balance?: number;
  payment_terms?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
  bank_branch?: string | null;
  remarks?: string | null;
  custom_fields?: Record<string, unknown>;
  reporting_tags?: string[];
  is_active?: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVendorPayload {
  display_name: string;
  company_name?: string | null;
  email?: string | null;
  work_phone?: string | null;
  mobile_phone?: string | null;
  billing_address_line1?: string | null;
  billing_address_line2?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_country?: string | null;
  billing_zip_code?: string | null;
  shipping_address_line1?: string | null;
  shipping_address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_country?: string | null;
  shipping_zip_code?: string | null;
  gst_treatment?: string | null;
  gstin?: string | null;
  source_of_supply?: string | null;
  pan?: string | null;
  is_msme_registered?: boolean;
  currency?: string | null;
  opening_balance?: number;
  payment_terms?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
  bank_branch?: string | null;
  remarks?: string | null;
  custom_fields?: Record<string, unknown>;
  reporting_tags?: string[];
  is_active?: boolean;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface UpdateVendorPayload extends Partial<CreateVendorPayload> {}

export interface VendorFormData extends CreateVendorPayload {}

export interface VendorFilters {
  search?: string;
  is_active?: boolean;
  source_of_supply?: string;
}
