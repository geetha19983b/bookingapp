// Unit type definitions based on backend schema

export interface Unit {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitPayload {
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
}

export interface UpdateUnitPayload {
  code?: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
  updatedBy?: string | null;
}

export interface ActiveUnit {
  id: number;
  code: string;
  name: string;
  description?: string | null;
}
