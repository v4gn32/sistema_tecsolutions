import { supabase } from '../lib/supabase';
import { Client, Service, Product, Proposal, HardwareInventory, SoftwareInventory, ServiceRecord } from '../types';

import { supabase } from '../lib/supabase';

// Verificar se o Supabase está configurado
const checkSupabaseConnection = () => {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Usando localStorage como fallback.');
  }
  return supabase;
};

// Clients
export const getClientsFromSupabase = async (): Promise<Client[]> => {
  const client = checkSupabaseConnection();
  const { data, error } = await client
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }

  return data.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    cnpj: client.cnpj,
    address: client.address,
    type: client.type as 'contrato' | 'avulso',
    createdAt: new Date(client.created_at)
  }));
};

export const saveClientToSupabase = async (client: Client): Promise<void> => {
  console.log('Salvando cliente no Supabase:', client);
  
  const supabaseClient = checkSupabaseConnection();
  
  const clientData = {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    cnpj: client.cnpj || null,
    address: client.address,
    type: client.type,
    created_at: client.createdAt.toISOString()
  };

  console.log('Dados formatados para Supabase:', clientData);

  const { error } = await supabaseClient
    .from('clients')
    .upsert(clientData);

  if (error) {
    console.error('Error saving client:', error);
    throw error;
  }
  
  console.log('Cliente salvo com sucesso no Supabase');
};

export const deleteClientFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Services
export const getServicesFromSupabase = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: parseFloat(service.price),
    category: service.category as Service['category'],
    unit: service.unit,
    createdAt: new Date(service.created_at)
  }));
};

export const saveServiceToSupabase = async (service: Service): Promise<void> => {
  const serviceData = {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    category: service.category,
    unit: service.unit,
    created_at: service.createdAt.toISOString()
  };

  const { error } = await supabase
    .from('services')
    .upsert(serviceData);

  if (error) {
    console.error('Error saving service:', error);
    throw error;
  }
};

export const deleteServiceFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Products
export const getProductsFromSupabase = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    category: product.category as Product['category'],
    unit: product.unit,
    brand: product.brand,
    model: product.model,
    stock: product.stock,
    createdAt: new Date(product.created_at)
  }));
};

export const saveProductToSupabase = async (product: Product): Promise<void> => {
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    unit: product.unit,
    brand: product.brand,
    model: product.model,
    stock: product.stock,
    created_at: product.createdAt.toISOString()
  };

  const { error } = await supabase
    .from('products')
    .upsert(productData);

  if (error) {
    console.error('Error saving product:', error);
    throw error;
  }
};

export const deleteProductFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Proposals
export const getProposalsFromSupabase = async (): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }

  return data.map(proposal => ({
    id: proposal.id,
    clientId: proposal.client_id,
    number: proposal.number,
    title: proposal.title,
    description: proposal.description,
    items: proposal.items,
    productItems: proposal.product_items,
    subtotal: parseFloat(proposal.subtotal),
    discount: parseFloat(proposal.discount),
    total: parseFloat(proposal.total),
    status: proposal.status as Proposal['status'],
    validUntil: new Date(proposal.valid_until),
    notes: proposal.notes,
    createdAt: new Date(proposal.created_at),
    updatedAt: new Date(proposal.updated_at)
  }));
};

export const saveProposalToSupabase = async (proposal: Proposal): Promise<void> => {
  const proposalData = {
    id: proposal.id,
    client_id: proposal.clientId,
    number: proposal.number,
    title: proposal.title,
    description: proposal.description,
    items: proposal.items,
    product_items: proposal.productItems,
    subtotal: proposal.subtotal,
    discount: proposal.discount,
    total: proposal.total,
    status: proposal.status,
    valid_until: proposal.validUntil.toISOString(),
    notes: proposal.notes,
    created_at: proposal.createdAt.toISOString(),
    updated_at: proposal.updatedAt.toISOString()
  };

  const { error } = await supabase
    .from('proposals')
    .upsert(proposalData);

  if (error) {
    console.error('Error saving proposal:', error);
    throw error;
  }
};

export const deleteProposalFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting proposal:', error);
    throw error;
  }
};

// Hardware Inventory
export const getHardwareInventoryFromSupabase = async (): Promise<HardwareInventory[]> => {
  const { data, error } = await supabase
    .from('hardware_inventory')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hardware inventory:', error);
    return [];
  }

  return data.map(hardware => ({
    id: hardware.id,
    clientId: hardware.client_id,
    brand: hardware.brand,
    model: hardware.model,
    serialNumber: hardware.serial_number,
    processor: hardware.processor,
    memory: hardware.memory,
    storage: hardware.storage,
    operatingSystem: hardware.operating_system,
    deviceName: hardware.device_name,
    office: hardware.office,
    antivirus: hardware.antivirus,
    username: hardware.username,
    password: hardware.password,
    pin: hardware.pin,
    warranty: hardware.warranty,
    createdAt: new Date(hardware.created_at),
    updatedAt: new Date(hardware.updated_at)
  }));
};

export const saveHardwareInventoryToSupabase = async (hardware: HardwareInventory): Promise<void> => {
  const hardwareData = {
    id: hardware.id,
    client_id: hardware.clientId,
    brand: hardware.brand,
    model: hardware.model,
    serial_number: hardware.serialNumber,
    processor: hardware.processor,
    memory: hardware.memory,
    storage: hardware.storage,
    operating_system: hardware.operatingSystem,
    device_name: hardware.deviceName,
    office: hardware.office,
    antivirus: hardware.antivirus,
    username: hardware.username,
    password: hardware.password,
    pin: hardware.pin,
    warranty: hardware.warranty,
    created_at: hardware.createdAt.toISOString(),
    updated_at: hardware.updatedAt.toISOString()
  };

  const { error } = await supabase
    .from('hardware_inventory')
    .upsert(hardwareData);

  if (error) {
    console.error('Error saving hardware inventory:', error);
    throw error;
  }
};

export const deleteHardwareInventoryFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('hardware_inventory')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting hardware inventory:', error);
    throw error;
  }
};

export const getHardwareByClientFromSupabase = async (clientId: string): Promise<HardwareInventory[]> => {
  const { data, error } = await supabase
    .from('hardware_inventory')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hardware by client:', error);
    return [];
  }

  return data.map(hardware => ({
    id: hardware.id,
    clientId: hardware.client_id,
    brand: hardware.brand,
    model: hardware.model,
    serialNumber: hardware.serial_number,
    processor: hardware.processor,
    memory: hardware.memory,
    storage: hardware.storage,
    operatingSystem: hardware.operating_system,
    deviceName: hardware.device_name,
    office: hardware.office,
    antivirus: hardware.antivirus,
    username: hardware.username,
    password: hardware.password,
    pin: hardware.pin,
    warranty: hardware.warranty,
    createdAt: new Date(hardware.created_at),
    updatedAt: new Date(hardware.updated_at)
  }));
};

// Software Inventory
export const getSoftwareInventoryFromSupabase = async (): Promise<SoftwareInventory[]> => {
  const { data, error } = await supabase
    .from('software_inventory')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching software inventory:', error);
    return [];
  }

  return data.map(software => ({
    id: software.id,
    clientId: software.client_id,
    login: software.login,
    password: software.password,
    softwareName: software.software_name,
    softwareType: software.software_type as SoftwareInventory['softwareType'],
    expirationAlert: new Date(software.expiration_alert),
    monthlyValue: software.monthly_value ? parseFloat(software.monthly_value) : undefined,
    annualValue: software.annual_value ? parseFloat(software.annual_value) : undefined,
    userControl: software.user_control as SoftwareInventory['userControl'],
    createdAt: new Date(software.created_at),
    updatedAt: new Date(software.updated_at)
  }));
};

export const saveSoftwareInventoryToSupabase = async (software: SoftwareInventory): Promise<void> => {
  const softwareData = {
    id: software.id,
    client_id: software.clientId,
    login: software.login,
    password: software.password,
    software_name: software.softwareName,
    software_type: software.softwareType,
    expiration_alert: software.expirationAlert.toISOString(),
    monthly_value: software.monthlyValue,
    annual_value: software.annualValue,
    user_control: software.userControl,
    created_at: software.createdAt.toISOString(),
    updated_at: software.updatedAt.toISOString()
  };

  const { error } = await supabase
    .from('software_inventory')
    .upsert(softwareData);

  if (error) {
    console.error('Error saving software inventory:', error);
    throw error;
  }
};

export const deleteSoftwareInventoryFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('software_inventory')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting software inventory:', error);
    throw error;
  }
};

export const getSoftwareByClientFromSupabase = async (clientId: string): Promise<SoftwareInventory[]> => {
  const { data, error } = await supabase
    .from('software_inventory')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching software by client:', error);
    return [];
  }

  return data.map(software => ({
    id: software.id,
    clientId: software.client_id,
    login: software.login,
    password: software.password,
    softwareName: software.software_name,
    softwareType: software.software_type as SoftwareInventory['softwareType'],
    expirationAlert: new Date(software.expiration_alert),
    monthlyValue: software.monthly_value ? parseFloat(software.monthly_value) : undefined,
    annualValue: software.annual_value ? parseFloat(software.annual_value) : undefined,
    userControl: software.user_control as SoftwareInventory['userControl'],
    createdAt: new Date(software.created_at),
    updatedAt: new Date(software.updated_at)
  }));
};

// Service Records
export const getServiceRecordsFromSupabase = async (): Promise<ServiceRecord[]> => {
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching service records:', error);
    return [];
  }

  return data.map(record => ({
    id: record.id,
    clientId: record.client_id,
    type: record.type as ServiceRecord['type'],
    date: new Date(record.date),
    description: record.description,
    services: record.services,
    arrivalTime: record.arrival_time,
    departureTime: record.departure_time,
    lunchBreak: record.lunch_break,
    totalHours: record.total_hours ? parseFloat(record.total_hours) : undefined,
    deviceReceived: record.device_received ? new Date(record.device_received) : undefined,
    deviceReturned: record.device_returned ? new Date(record.device_returned) : undefined,
    labServices: record.lab_services,
    thirdPartyCompany: record.third_party_company,
    sentDate: record.sent_date ? new Date(record.sent_date) : undefined,
    returnedDate: record.returned_date ? new Date(record.returned_date) : undefined,
    cost: record.cost ? parseFloat(record.cost) : undefined,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
    createdBy: record.created_by
  }));
};

export const saveServiceRecordToSupabase = async (record: ServiceRecord): Promise<void> => {
  const recordData = {
    id: record.id,
    client_id: record.clientId,
    type: record.type,
    date: record.date.toISOString(),
    description: record.description,
    services: record.services,
    arrival_time: record.arrivalTime,
    departure_time: record.departureTime,
    lunch_break: record.lunchBreak,
    total_hours: record.totalHours,
    device_received: record.deviceReceived?.toISOString(),
    device_returned: record.deviceReturned?.toISOString(),
    lab_services: record.labServices,
    third_party_company: record.thirdPartyCompany,
    sent_date: record.sentDate?.toISOString(),
    returned_date: record.returnedDate?.toISOString(),
    cost: record.cost,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
    created_by: record.createdBy
  };

  const { error } = await supabase
    .from('service_records')
    .upsert(recordData);

  if (error) {
    console.error('Error saving service record:', error);
    throw error;
  }
};

export const deleteServiceRecordFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('service_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service record:', error);
    throw error;
  }
};

export const getServiceRecordsByClientFromSupabase = async (clientId: string): Promise<ServiceRecord[]> => {
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching service records by client:', error);
    return [];
  }

  return data.map(record => ({
    id: record.id,
    clientId: record.client_id,
    type: record.type as ServiceRecord['type'],
    date: new Date(record.date),
    description: record.description,
    services: record.services,
    arrivalTime: record.arrival_time,
    departureTime: record.departure_time,
    lunchBreak: record.lunch_break,
    totalHours: record.total_hours ? parseFloat(record.total_hours) : undefined,
    deviceReceived: record.device_received ? new Date(record.device_received) : undefined,
    deviceReturned: record.device_returned ? new Date(record.device_returned) : undefined,
    labServices: record.lab_services,
    thirdPartyCompany: record.third_party_company,
    sentDate: record.sent_date ? new Date(record.sent_date) : undefined,
    returnedDate: record.returned_date ? new Date(record.returned_date) : undefined,
    cost: record.cost ? parseFloat(record.cost) : undefined,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
    createdBy: record.created_by
  }));
};