export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  createdBy?: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// DTOs para criação e atualização
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  document: string;
  notes?: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  type?: 'INDIVIDUAL' | 'COMPANY';
  document?: string;
  notes?: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  category: 'SUPPORT' | 'INSTALLATION' | 'MAINTENANCE' | 'CONSULTING' | 'TRAINING';
  price: number;
  estimatedHours?: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  category?: 'SUPPORT' | 'INSTALLATION' | 'MAINTENANCE' | 'CONSULTING' | 'TRAINING';
  price?: number;
  estimatedHours?: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'ACCESSORY';
  price: number;
  stock?: number;
  brand?: string;
  model?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  category?: 'HARDWARE' | 'SOFTWARE' | 'ACCESSORY';
  price?: number;
  stock?: number;
  brand?: string;
  model?: string;
}

export interface CreateProposalDto {
  clientId: string;
  title: string;
  description: string;
  validUntil: Date;
  services?: Array<{
    serviceId: string;
    quantity: number;
    unitPrice: number;
    description?: string;
  }>;
  products?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    description?: string;
  }>;
}

export interface UpdateProposalDto {
  title?: string;
  description?: string;
  validUntil?: Date;
  status?: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  services?: Array<{
    serviceId: string;
    quantity: number;
    unitPrice: number;
    description?: string;
  }>;
  products?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    description?: string;
  }>;
}

export interface CreateHardwareInventoryDto {
  clientId: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  specifications?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DISPOSED';
  notes?: string;
}

export interface UpdateHardwareInventoryDto {
  name?: string;
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  specifications?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  location?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DISPOSED';
  notes?: string;
}

export interface CreateSoftwareInventoryDto {
  clientId: string;
  name: string;
  type: 'OPERATING_SYSTEM' | 'APPLICATION' | 'ANTIVIRUS' | 'OFFICE' | 'OTHER';
  version?: string;
  licenseKey?: string;
  purchaseDate?: Date;
  expiryDate?: Date;
  userControl: 'SINGLE_USER' | 'MULTI_USER' | 'ENTERPRISE';
  maxUsers?: number;
  currentUsers?: number;
  notes?: string;
}

export interface UpdateSoftwareInventoryDto {
  name?: string;
  type?: 'OPERATING_SYSTEM' | 'APPLICATION' | 'ANTIVIRUS' | 'OFFICE' | 'OTHER';
  version?: string;
  licenseKey?: string;
  purchaseDate?: Date;
  expiryDate?: Date;
  userControl?: 'SINGLE_USER' | 'MULTI_USER' | 'ENTERPRISE';
  maxUsers?: number;
  currentUsers?: number;
  notes?: string;
}

export interface CreateServiceRecordDto {
  clientId: string;
  type: 'SUPPORT' | 'MAINTENANCE' | 'INSTALLATION' | 'CONSULTATION';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  scheduledDate?: Date;
}

export interface UpdateServiceRecordDto {
  type?: 'SUPPORT' | 'MAINTENANCE' | 'INSTALLATION' | 'CONSULTATION';
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  resolution?: string;
  timeSpent?: number;
}