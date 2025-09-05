import { Client, Service, Product, Proposal, HardwareInventory, SoftwareInventory, ServiceRecord } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Função para obter o token de autenticação
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Função para fazer requisições HTTP
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ===== CLIENTS =====
export const getClientsFromAPI = async (): Promise<Client[]> => {
  const response = await apiRequest('/clients');
  return response.data.clients.map((client: any) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    cnpj: client.cnpj,
    address: client.address,
    type: client.type as 'contrato' | 'avulso',
    createdAt: new Date(client.createdAt)
  }));
};

export const saveClientToAPI = async (client: Client): Promise<void> => {
  const clientData = {
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    cnpj: client.cnpj,
    address: client.address,
    type: client.type
  };

  if (client.id && client.id !== Date.now().toString()) {
    // Atualizar cliente existente
    await apiRequest(`/clients/${client.id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  } else {
    // Criar novo cliente
    await apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }
};

export const deleteClientFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/clients/${id}`, {
    method: 'DELETE',
  });
};

// ===== SERVICES =====
export const getServicesFromAPI = async (): Promise<Service[]> => {
  const response = await apiRequest('/services');
  return response.data.services.map((service: any) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: parseFloat(service.price),
    category: service.category as Service['category'],
    unit: service.unit,
    createdAt: new Date(service.createdAt)
  }));
};

export const saveServiceToAPI = async (service: Service): Promise<void> => {
  const serviceData = {
    name: service.name,
    description: service.description,
    price: service.price,
    category: service.category,
    unit: service.unit
  };

  if (service.id && service.id !== Date.now().toString()) {
    await apiRequest(`/services/${service.id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  } else {
    await apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }
};

export const deleteServiceFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/services/${id}`, {
    method: 'DELETE',
  });
};

// ===== PRODUCTS =====
export const getProductsFromAPI = async (): Promise<Product[]> => {
  const response = await apiRequest('/products');
  return response.data.products.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    category: product.category as Product['category'],
    unit: product.unit,
    brand: product.brand,
    model: product.model,
    stock: product.stock,
    createdAt: new Date(product.createdAt)
  }));
};

export const saveProductToAPI = async (product: Product): Promise<void> => {
  const productData = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    unit: product.unit,
    brand: product.brand,
    model: product.model,
    stock: product.stock
  };

  if (product.id && product.id !== Date.now().toString()) {
    await apiRequest(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  } else {
    await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
};

export const deleteProductFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
};

// ===== PROPOSALS =====
export const getProposalsFromAPI = async (): Promise<Proposal[]> => {
  const response = await apiRequest('/proposals');
  return response.data.proposals.map((proposal: any) => ({
    id: proposal.id,
    clientId: proposal.clientId,
    title: proposal.title,
    description: proposal.description,
    status: proposal.status,
    validUntil: new Date(proposal.validUntil),
    serviceItems: proposal.serviceItems || [],
    productItems: proposal.productItems || [],
    subtotal: parseFloat(proposal.subtotal),
    discount: parseFloat(proposal.discount || 0),
    total: parseFloat(proposal.total),
    createdAt: new Date(proposal.createdAt),
    updatedAt: new Date(proposal.updatedAt)
  }));
};

export const saveProposalToAPI = async (proposal: Proposal): Promise<void> => {
  const proposalData = {
    clientId: proposal.clientId,
    title: proposal.title,
    description: proposal.description,
    status: proposal.status,
    validUntil: proposal.validUntil.toISOString(),
    serviceItems: proposal.serviceItems,
    productItems: proposal.productItems,
    discount: proposal.discount || 0
  };

  if (proposal.id && proposal.id !== Date.now().toString()) {
    await apiRequest(`/proposals/${proposal.id}`, {
      method: 'PUT',
      body: JSON.stringify(proposalData),
    });
  } else {
    await apiRequest('/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  }
};

export const deleteProposalFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/proposals/${id}`, {
    method: 'DELETE',
  });
};

// ===== HARDWARE INVENTORY =====
export const getHardwareInventoryFromAPI = async (): Promise<HardwareInventory[]> => {
  const response = await apiRequest('/inventory/hardware');
  return response.data.items.map((item: any) => ({
    id: item.id,
    clientId: item.clientId,
    brand: item.brand || '',
    model: item.model || '',
    serialNumber: item.serialNumber || '',
    processor: item.specifications || '',
    memory: item.specifications || '',
    storage: item.specifications || '',
    operatingSystem: item.specifications || '',
    deviceName: item.name || '',
    office: item.location || '',
    antivirus: item.notes || '',
    username: '',
    password: '',
    pin: '',
    warranty: item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString() : '',
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt)
  }));
};

export const saveHardwareInventoryToAPI = async (hardware: HardwareInventory): Promise<void> => {
  const hardwareData = {
    clientId: hardware.clientId,
    name: hardware.deviceName,
    type: 'COMPUTER',
    brand: hardware.brand,
    model: hardware.model,
    serialNumber: hardware.serialNumber,
    specifications: `${hardware.processor} | ${hardware.memory} | ${hardware.storage} | ${hardware.operatingSystem}`,
    location: hardware.office,
    status: 'ACTIVE',
    notes: `Antivirus: ${hardware.antivirus} | User: ${hardware.username}`
  };

  if (hardware.id && hardware.id !== Date.now().toString()) {
    await apiRequest(`/inventory/hardware/${hardware.id}`, {
      method: 'PUT',
      body: JSON.stringify(hardwareData),
    });
  } else {
    await apiRequest('/inventory/hardware', {
      method: 'POST',
      body: JSON.stringify(hardwareData),
    });
  }
};

export const deleteHardwareInventoryFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/inventory/hardware/${id}`, {
    method: 'DELETE',
  });
};

export const getHardwareByClientFromAPI = async (clientId: string): Promise<HardwareInventory[]> => {
  const response = await apiRequest(`/inventory/hardware?clientId=${clientId}`);
  return response.data.items.map((item: any) => ({
    id: item.id,
    clientId: item.clientId,
    brand: item.brand || '',
    model: item.model || '',
    serialNumber: item.serialNumber || '',
    processor: item.specifications || '',
    memory: item.specifications || '',
    storage: item.specifications || '',
    operatingSystem: item.specifications || '',
    deviceName: item.name || '',
    office: item.location || '',
    antivirus: item.notes || '',
    username: '',
    password: '',
    pin: '',
    warranty: item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString() : '',
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt)
  }));
};

// ===== SOFTWARE INVENTORY =====
export const getSoftwareInventoryFromAPI = async (): Promise<SoftwareInventory[]> => {
  const response = await apiRequest('/inventory/software');
  return response.data.items.map((item: any) => ({
    id: item.id,
    clientId: item.clientId,
    login: item.licenseKey || '',
    password: '',
    softwareName: item.name,
    softwareType: 'local' as SoftwareInventory['softwareType'],
    expirationAlert: item.expiryDate ? new Date(item.expiryDate) : new Date(),
    monthlyValue: 0,
    annualValue: 0,
    userControl: 'none' as SoftwareInventory['userControl'],
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt)
  }));
};

export const saveSoftwareInventoryToAPI = async (software: SoftwareInventory): Promise<void> => {
  const softwareData = {
    clientId: software.clientId,
    name: software.softwareName,
    version: '1.0',
    vendor: 'Unknown',
    licenseType: 'PERPETUAL',
    licenseKey: software.login,
    maxInstallations: 1,
    currentInstallations: 1,
    expiryDate: software.expirationAlert.toISOString(),
    status: 'ACTIVE'
  };

  if (software.id && software.id !== Date.now().toString()) {
    await apiRequest(`/inventory/software/${software.id}`, {
      method: 'PUT',
      body: JSON.stringify(softwareData),
    });
  } else {
    await apiRequest('/inventory/software', {
      method: 'POST',
      body: JSON.stringify(softwareData),
    });
  }
};

export const deleteSoftwareInventoryFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/inventory/software/${id}`, {
    method: 'DELETE',
  });
};

export const getSoftwareByClientFromAPI = async (clientId: string): Promise<SoftwareInventory[]> => {
  const response = await apiRequest(`/inventory/software?clientId=${clientId}`);
  return response.data.items.map((item: any) => ({
    id: item.id,
    clientId: item.clientId,
    login: item.licenseKey || '',
    password: '',
    softwareName: item.name,
    softwareType: 'local' as SoftwareInventory['softwareType'],
    expirationAlert: item.expiryDate ? new Date(item.expiryDate) : new Date(),
    monthlyValue: 0,
    annualValue: 0,
    userControl: 'none' as SoftwareInventory['userControl'],
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt)
  }));
};

// ===== SERVICE RECORDS =====
export const getServiceRecordsFromAPI = async (): Promise<ServiceRecord[]> => {
  const response = await apiRequest('/service-records');
  return response.data.records.map((record: any) => ({
    id: record.id,
    clientId: record.clientId,
    type: record.type as ServiceRecord['type'],
    date: new Date(record.scheduledDate || record.createdAt),
    description: record.description,
    services: [],
    arrivalTime: '',
    departureTime: '',
    lunchBreak: false,
    totalHours: record.timeSpent || 0,
    deviceReceived: record.createdAt ? new Date(record.createdAt) : undefined,
    deviceReturned: record.completedDate ? new Date(record.completedDate) : undefined,
    labServices: [],
    thirdPartyCompany: '',
    sentDate: record.scheduledDate ? new Date(record.scheduledDate) : undefined,
    returnedDate: record.completedDate ? new Date(record.completedDate) : undefined,
    cost: 0,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    createdBy: record.userId || ''
  }));
};

export const saveServiceRecordToAPI = async (record: ServiceRecord): Promise<void> => {
  const recordData = {
    clientId: record.clientId,
    type: record.type.toUpperCase(),
    title: `Atendimento ${record.type}`,
    description: record.description,
    priority: 'MEDIUM',
    scheduledDate: record.date.toISOString(),
    timeSpent: record.totalHours || 0,
    notes: JSON.stringify({
      services: record.services,
      arrivalTime: record.arrivalTime,
      departureTime: record.departureTime,
      lunchBreak: record.lunchBreak,
      deviceReceived: record.deviceReceived,
      deviceReturned: record.deviceReturned,
      labServices: record.labServices,
      thirdPartyCompany: record.thirdPartyCompany,
      sentDate: record.sentDate,
      returnedDate: record.returnedDate,
      cost: record.cost
    })
  };

  if (record.id && record.id !== Date.now().toString()) {
    await apiRequest(`/service-records/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData),
    });
  } else {
    await apiRequest('/service-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }
};

export const deleteServiceRecordFromAPI = async (id: string): Promise<void> => {
  await apiRequest(`/service-records/${id}`, {
    method: 'DELETE',
  });
};

export const getServiceRecordsByClientFromAPI = async (clientId: string): Promise<ServiceRecord[]> => {
  const response = await apiRequest(`/service-records?clientId=${clientId}`);
  return response.data.records.map((record: any) => ({
    id: record.id,
    clientId: record.clientId,
    type: record.type.toLowerCase() as ServiceRecord['type'],
    date: new Date(record.scheduledDate || record.createdAt),
    description: record.description,
    services: [],
    arrivalTime: '',
    departureTime: '',
    lunchBreak: false,
    totalHours: record.timeSpent || 0,
    deviceReceived: record.createdAt ? new Date(record.createdAt) : undefined,
    deviceReturned: record.completedDate ? new Date(record.completedDate) : undefined,
    labServices: [],
    thirdPartyCompany: '',
    sentDate: record.scheduledDate ? new Date(record.scheduledDate) : undefined,
    returnedDate: record.completedDate ? new Date(record.completedDate) : undefined,
    cost: 0,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    createdBy: record.userId || ''
  }));
};