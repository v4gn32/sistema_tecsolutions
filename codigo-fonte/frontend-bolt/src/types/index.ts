export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  cnpj?: string;
  address: string;
  type: 'contrato' | 'avulso';
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'infraestrutura' | 'helpdesk' | 'nuvem' | 'backup' | 'cabeamento' | 'outros';
  unit: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cabos' | 'conectores' | 'equipamentos' | 'acessorios' | 'outros';
  unit: string;
  brand?: string;
  model?: string;
  stock?: number;
  createdAt: Date;
}

export interface ProposalItem {
  serviceId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProposalProductItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proposal {
  id: string;
  clientId: string;
  number: string;
  title: string;
  description: string;
  items: ProposalItem[];
  productItems: ProposalProductItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'recusada';
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface ProposalWithDetails extends Proposal {
  client: Client;
  services: Service[];
  products: Product[];
}

export interface HardwareInventory {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  serialNumber: string;
  processor: string;
  memory: string;
  storage: string;
  operatingSystem: string;
  deviceName: string;
  office: string;
  antivirus: string;
  username: string;
  password: string;
  pin: string;
  warranty: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftwareInventory {
  id: string;
  clientId: string;
  login: string;
  password: string;
  softwareName: string;
  softwareType: 'local' | 'cloud' | 'subscription' | 'license' | 'outros';
  expirationAlert: Date;
  monthlyValue?: number;
  annualValue?: number;
  userControl: 'ad_local' | 'cloud' | 'none';
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRecord {
  id: string;
  clientId: string;
  type: 'remote' | 'onsite' | 'laboratory' | 'third_party';
  date: Date;
  description: string;
  services: string[];
  
  // Campos específicos para atendimento presencial
  arrivalTime?: string;
  departureTime?: string;
  lunchBreak?: boolean; // 1 hora de almoço
  totalHours?: number;
  
  // Campos específicos para laboratório
  deviceReceived?: Date;
  deviceReturned?: Date;
  labServices?: string[];
  
  // Campos específicos para terceiros
  thirdPartyCompany?: string;
  sentDate?: Date;
  returnedDate?: Date;
  cost?: number;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}