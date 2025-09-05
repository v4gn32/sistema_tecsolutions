import { Client, Service, Product, Proposal, HardwareInventory, SoftwareInventory, ServiceRecord } from '../types';
import {
  getClientsFromAPI,
  saveClientToAPI,
  deleteClientFromAPI,
  getServicesFromAPI,
  saveServiceToAPI,
  deleteServiceFromAPI,
  getProductsFromAPI,
  saveProductToAPI,
  deleteProductFromAPI,
  getProposalsFromAPI,
  saveProposalToAPI,
  deleteProposalFromAPI,
  getHardwareInventoryFromAPI,
  saveHardwareInventoryToAPI,
  deleteHardwareInventoryFromAPI,
  getHardwareByClientFromAPI,
  getSoftwareInventoryFromAPI,
  saveSoftwareInventoryToAPI,
  deleteSoftwareInventoryFromAPI,
  getSoftwareByClientFromAPI,
  getServiceRecordsFromAPI,
  saveServiceRecordToAPI,
  deleteServiceRecordFromAPI,
  getServiceRecordsByClientFromAPI
} from './api';

const STORAGE_KEYS = {
  CLIENTS: 'tecsolutions_clients',
  SERVICES: 'tecsolutions_services',
  PRODUCTS: 'tecsolutions_products',
  PROPOSALS: 'tecsolutions_proposals',
  HARDWARE_INVENTORY: 'tecsolutions_hardware_inventory',
  SOFTWARE_INVENTORY: 'tecsolutions_software_inventory',
  SERVICE_RECORDS: 'tecsolutions_service_records',
};

// Check if we should use API backend or localStorage
const useAPI = () => {
  const hasAPIConfig = !!(import.meta.env.VITE_API_URL || 'http://localhost:3001/api');
  const hasToken = !!localStorage.getItem('token');
  console.log('Verificando configuração API:', {
    hasAPIConfig,
    hasToken,
    useAPI: hasAPIConfig && hasToken
  });
  return hasAPIConfig && hasToken;
};

// Clients
export const getClients = async (): Promise<Client[]> => {
  console.log('Carregando clientes...');
  
  if (useAPI()) {
    console.log('Carregando da API');
    try {
      return await getClientsFromAPI();
    } catch (error) {
      console.error('Erro ao carregar clientes da API:', error);
      // Fallback para localStorage
    }
  }
  
  console.log('Carregando do localStorage');
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  const clients = data ? JSON.parse(data) : [];
  console.log('Clientes carregados:', clients);
  return clients;
};

export const saveClient = async (client: Client): Promise<void> => {
  console.log('Tentando salvar cliente:', client);
  
  try {
    if (useAPI()) {
      console.log('Usando API para salvar cliente');
      return await saveClientToAPI(client);
    }
    
    console.log('Usando localStorage para salvar cliente');
    const clients = await getClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
      console.log('Cliente atualizado na posição:', existingIndex);
    } else {
      clients.push(client);
      console.log('Novo cliente adicionado. Total de clientes:', clients.length);
    }
    
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    console.log('Cliente salvo no localStorage com sucesso');
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  console.log('Tentando deletar cliente com ID:', id);
  
  try {
    if (useAPI()) {
      console.log('Usando API para deletar cliente');
      return await deleteClientFromAPI(id);
    }
    
    console.log('Usando localStorage para deletar cliente');
    const clients = await getClients();
    const filteredClients = clients.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filteredClients));
    console.log('Cliente deletado do localStorage. Clientes restantes:', filteredClients.length);
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw error;
  }
};

// Services
export const getServices = async (): Promise<Service[]> => {
  if (useAPI()) {
    try {
      return await getServicesFromAPI();
    } catch (error) {
      console.error('Erro ao carregar serviços da API:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

export const saveService = async (service: Service): Promise<void> => {
  if (useAPI()) {
    try {
      return await saveServiceToAPI(service);
    } catch (error) {
      console.error('Erro ao salvar serviço na API:', error);
      throw error;
    }
  }
  
  const services = await getServices();
  const existingIndex = services.findIndex(s => s.id === service.id);
  
  if (existingIndex >= 0) {
    services[existingIndex] = service;
  } else {
    services.push(service);
  }
  
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const deleteService = async (id: string): Promise<void> => {
  if (useAPI()) {
    try {
      return await deleteServiceFromAPI(id);
    } catch (error) {
      console.error('Erro ao deletar serviço da API:', error);
      throw error;
    }
  }
  
  const services = await getServices();
  const filteredServices = services.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filteredServices));
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  if (useAPI()) {
    try {
      return await getProductsFromAPI();
    } catch (error) {
      console.error('Erro ao carregar produtos da API:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProduct = async (product: Product): Promise<void> => {
  if (useAPI()) {
    try {
      return await saveProductToAPI(product);
    } catch (error) {
      console.error('Erro ao salvar produto na API:', error);
      throw error;
    }
  }
  
  const products = await getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (useAPI()) {
    try {
      return await deleteProductFromAPI(id);
    } catch (error) {
      console.error('Erro ao deletar produto da API:', error);
      throw error;
    }
  }
  
  const products = await getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));
};

// Proposals
export const getProposals = async (): Promise<Proposal[]> => {
  if (useAPI()) {
    try {
      return await getProposalsFromAPI();
    } catch (error) {
      console.error('Erro ao carregar propostas da API:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
  return data ? JSON.parse(data) : [];
};

export const saveProposal = async (proposal: Proposal): Promise<void> => {
  if (useAPI()) {
    try {
      return await saveProposalToAPI(proposal);
    } catch (error) {
      console.error('Erro ao salvar proposta na API:', error);
      throw error;
    }
  }
  
  const proposals = await getProposals();
  const existingIndex = proposals.findIndex(p => p.id === proposal.id);
  
  if (existingIndex >= 0) {
    proposals[existingIndex] = proposal;
  } else {
    proposals.push(proposal);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
};

export const deleteProposal = async (id: string): Promise<void> => {
  if (useAPI()) {
    try {
      return await deleteProposalFromAPI(id);
    } catch (error) {
      console.error('Erro ao deletar proposta da API:', error);
      throw error;
    }
  }
  
  const proposals = await getProposals();
  const filteredProposals = proposals.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(filteredProposals));
};

// Hardware Inventory
export const getHardwareInventory = async (): Promise<HardwareInventory[]> => {
  if (useAPI()) {
    try {
      return await getHardwareInventoryFromAPI();
    } catch (error) {
      console.error('Erro ao carregar inventário de hardware da API:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.HARDWARE_INVENTORY);
  return data ? JSON.parse(data) : [];
};

export const saveHardwareInventory = async (hardware: HardwareInventory): Promise<void> => {
  if (useAPI()) {
    try {
      return await saveHardwareInventoryToAPI(hardware);
    } catch (error) {
      console.error('Erro ao salvar hardware na API:', error);
      throw error;
    }
  }
  
  const inventory = await getHardwareInventory();
  const existingIndex = inventory.findIndex(h => h.id === hardware.id);
  
  if (existingIndex >= 0) {
    inventory[existingIndex] = hardware;
  } else {
    inventory.push(hardware);
  }
  
  localStorage.setItem(STORAGE_KEYS.HARDWARE_INVENTORY, JSON.stringify(inventory));
};

export const deleteHardwareInventory = async (id: string): Promise<void> => {
  if (useAPI()) {
    try {
      return await deleteHardwareInventoryFromAPI(id);
    } catch (error) {
      console.error('Erro ao deletar hardware da API:', error);
      throw error;
    }
  }
  
  const inventory = await getHardwareInventory();
  const filteredInventory = inventory.filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEYS.HARDWARE_INVENTORY, JSON.stringify(filteredInventory));
};

export const getHardwareByClient = async (clientId: string): Promise<HardwareInventory[]> => {
  if (useAPI()) {
    try {
      return await getHardwareByClientFromAPI(clientId);
    } catch (error) {
      console.error('Erro ao carregar hardware por cliente da API:', error);
    }
  }
  
  const inventory = await getHardwareInventory();
  return inventory.filter(h => h.clientId === clientId);
};

// Software Inventory
export const getSoftwareInventory = async (): Promise<SoftwareInventory[]> => {
  if (useAPI()) {
    try {
      return await getSoftwareInventoryFromAPI();
    } catch (error) {
      console.error('Erro ao carregar inventário de software da API:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.SOFTWARE_INVENTORY);
  return data ? JSON.parse(data) : [];
};

export const saveSoftwareInventory = async (software: SoftwareInventory): Promise<void> => {
  if (useAPI()) {
    try {
      return await saveSoftwareInventoryToAPI(software);
    } catch (error) {
      console.error('Erro ao salvar software na API:', error);
      throw error;
    }
  }
  
  const inventory = await getSoftwareInventory();
  const existingIndex = inventory.findIndex(s => s.id === software.id);
  
  if (existingIndex >= 0) {
    inventory[existingIndex] = software;
  } else {
    inventory.push(software);
  }
  
  localStorage.setItem(STORAGE_KEYS.SOFTWARE_INVENTORY, JSON.stringify(inventory));
};

export const deleteSoftwareInventory = async (id: string): Promise<void> => {
  if (useAPI()) {
    try {
      return await deleteSoftwareInventoryFromAPI(id);
    } catch (error) {
      console.error('Erro ao deletar software da API:', error);
      throw error;
    }
  }
  
  const inventory = await getSoftwareInventory();
  const filteredInventory = inventory.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SOFTWARE_INVENTORY, JSON.stringify(filteredInventory));
};

export const getSoftwareByClient = async (clientId: string): Promise<SoftwareInventory[]> => {
  if (useAPI()) {
    try {
      return await getSoftwareByClientFromAPI(clientId);
    } catch (error) {
      console.error('Erro ao carregar software por cliente da API:', error);
    }
  }
  
  const inventory = await getSoftwareInventory();
  return inventory.filter(s => s.clientId === clientId);
};

// Service Records
export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
  if (useAPI()) {
    try {
      return await getServiceRecordsFromAPI();
    } catch (error) {
      console.error('Erro ao carregar registros de atendimento da API:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.SERVICE_RECORDS);
  return data ? JSON.parse(data) : [];
};

export const saveServiceRecord = async (record: ServiceRecord): Promise<void> => {
  if (useAPI()) {
    try {
      return await saveServiceRecordToAPI(record);
    } catch (error) {
      console.error('Erro ao salvar registro de atendimento na API:', error);
      throw error;
    }
  }
  
  const records = await getServiceRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(STORAGE_KEYS.SERVICE_RECORDS, JSON.stringify(records));
};

export const deleteServiceRecord = async (id: string): Promise<void> => {
  if (useAPI()) {
    try {
      return await deleteServiceRecordFromAPI(id);
    } catch (error) {
      console.error('Erro ao deletar registro de atendimento da API:', error);
      throw error;
    }
  }
  
  const records = await getServiceRecords();
  const filteredRecords = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.SERVICE_RECORDS, JSON.stringify(filteredRecords));
};

export const getServiceRecordsByClient = async (clientId: string): Promise<ServiceRecord[]> => {
  if (useAPI()) {
    try {
      return await getServiceRecordsByClientFromAPI(clientId);
    } catch (error) {
      console.error('Erro ao carregar registros por cliente da API:', error);
    }
  }
  
  const records = await getServiceRecords();
  return records.filter(r => r.clientId === clientId);
};

// Initialize with mock data if empty
export const initializeStorage = async (): Promise<void> => {
  // Skip initialization if using API (data is already in database)
  if (useAPI()) {
    return;
  }
  
  const clients = await getClients();
  if (clients.length === 0) {
    const mockClients = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@empresa.com',
        phone: '(11) 99999-9999',
        company: 'Empresa ABC Ltda',
        cnpj: '12.345.678/0001-90',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        type: 'contrato',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@comercio.com',
        phone: '(11) 88888-8888',
        company: 'Comércio XYZ',
        cnpj: '98.765.432/0001-10',
        address: 'Av. Paulista, 456 - São Paulo, SP',
        type: 'avulso',
        createdAt: new Date('2024-01-20'),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(mockClients));
  }

  const services = await getServices();
  if (services.length === 0) {
    const mockServices = [
      {
        id: '1',
        name: 'Configuração de Servidor',
        description: 'Instalação e configuração completa de servidor Windows/Linux',
        price: 800,
        category: 'infraestrutura',
        unit: 'unidade',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '2',
        name: 'Suporte Técnico Premium',
        description: 'Suporte técnico 24/7 com atendimento prioritário',
        price: 150,
        category: 'helpdesk',
        unit: 'mês',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '3',
        name: 'Backup em Nuvem',
        description: 'Solução de backup automatizado em nuvem com criptografia',
        price: 200,
        category: 'backup',
        unit: 'TB/mês',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '4',
        name: 'Migração para AWS',
        description: 'Migração completa de infraestrutura para Amazon Web Services',
        price: 2500,
        category: 'nuvem',
        unit: 'projeto',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '5',
        name: 'Cabeamento Estruturado',
        description: 'Instalação de rede estruturada com certificação',
        price: 80,
        category: 'cabeamento',
        unit: 'ponto',
        createdAt: new Date('2024-01-10'),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mockServices));
  }

  const products = await getProducts();
  if (products.length === 0) {
    const mockProducts = [
      {
        id: '1',
        name: 'Cabo de Rede Cat6 UTP',
        description: 'Cabo de rede categoria 6 UTP 4 pares 24AWG',
        price: 2.50,
        category: 'cabos',
        unit: 'metro',
        brand: 'Furukawa',
        model: 'Cat6 UTP',
        stock: 1000,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '2',
        name: 'Conector RJ45 Cat6',
        description: 'Conector RJ45 categoria 6 para cabo UTP',
        price: 0.80,
        category: 'conectores',
        unit: 'unidade',
        brand: 'Panduit',
        model: 'CJ688TGBU',
        stock: 500,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '3',
        name: 'Power Balun Passivo',
        description: 'Balun passivo para transmissão de vídeo e energia via UTP',
        price: 25.00,
        category: 'equipamentos',
        unit: 'par',
        brand: 'Intelbras',
        model: 'VB 1001 P',
        stock: 50,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '4',
        name: 'Patch Panel 24 Portas',
        description: 'Patch panel 24 portas categoria 6 19 polegadas',
        price: 120.00,
        category: 'equipamentos',
        unit: 'unidade',
        brand: 'Furukawa',
        model: 'PP24C6',
        stock: 20,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '5',
        name: 'Abraçadeira Plástica',
        description: 'Abraçadeira plástica para fixação de cabos',
        price: 0.15,
        category: 'acessorios',
        unit: 'unidade',
        brand: 'Hellermann',
        model: 'T50R',
        stock: 2000,
        createdAt: new Date('2024-01-10'),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
};