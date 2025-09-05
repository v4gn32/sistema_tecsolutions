import { Client, Service } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '(11) 99999-9999',
    company: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - São Paulo, SP',
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
    createdAt: new Date('2024-01-20'),
  },
];

export const mockServices: Service[] = [
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