import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Settings, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  PlusCircle,
  Package
} from 'lucide-react';
import { getProposals, getClients, getServices, getProducts } from '../utils/storage';
import { Proposal, Client, Service, Product } from '../types';
import StatusBadge from '../components/StatusBadge';

const Dashboard: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      const [proposalsData, clientsData, servicesData, productsData] = await Promise.all([
        getProposals(),
        getClients(),
        getServices(),
        getProducts()
      ]);
      setProposals(proposalsData);
      setClients(clientsData);
      setServices(servicesData);
      setProducts(productsData);
    };
    loadData();
  }, []);
  
  const stats = [
    {
      title: 'Total de Propostas',
      value: proposals.length,
      icon: FileText,
      color: 'bg-blue-600',
      change: '+12%'
    },
    {
      title: 'Clientes Ativos',
      value: clients.length,
      icon: Users,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Itens Cadastrados',
      value: services.length + products.length,
      icon: Settings,
      color: 'bg-indigo-600',
      change: '+8%'
    },
    {
      title: 'Taxa de Conversão',
      value: `${Math.round((proposals.filter(p => p.status === 'aprovada').length / proposals.length) * 100) || 0}%`,
      icon: TrendingUp,
      color: 'bg-cyan-500',
      change: '+3%'
    }
  ];
  
  const recentProposals = proposals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const totalValue = proposals
    .filter(p => p.status === 'aprovada')
    .reduce((sum, p) => sum + p.total, 0);
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/proposals/new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors duration-200"
          >
            <PlusCircle className="w-8 h-8 text-cyan-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Nova Proposta</p>
              <p className="text-sm text-gray-600">Criar uma nova proposta comercial</p>
            </div>
          </Link>
          
          <Link
            to="/clients"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors duration-200"
          >
            <Users className="w-8 h-8 text-cyan-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Gerenciar Clientes</p>
              <p className="text-sm text-gray-600">Cadastrar e editar clientes</p>
            </div>
          </Link>
          
          <Link
            to="/services"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors duration-200"
          >
            <Settings className="w-8 h-8 text-cyan-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Configurar Serviços</p>
              <p className="text-sm text-gray-600">Gerenciar catálogo de serviços</p>
            </div>
          </Link>
          
          <Link
            to="/products"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors duration-200"
          >
            <Package className="w-8 h-8 text-cyan-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Gerenciar Produtos</p>
              <p className="text-sm text-gray-600">Cadastrar cabos, conectores, etc.</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Recent Proposals and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Propostas Recentes</h3>
              <Link
                to="/proposals"
                className="text-sm text-cyan-600 hover:text-cyan-500 font-medium"
              >
                Ver todas
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentProposals.length > 0 ? (
              <div className="space-y-4">
                {recentProposals.map((proposal) => {
                  const client = clients.find(c => c.id === proposal.clientId);
                  return (
                    <div key={proposal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{proposal.number}</p>
                        <p className="text-sm text-gray-600">{client?.company || 'Cliente não encontrado'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={proposal.status} />
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          R$ {proposal.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma proposta criada ainda</p>
                <Link
                  to="/proposals/new"
                  className="mt-2 inline-flex items-center text-sm text-cyan-600 hover:text-cyan-500"
                >
                  Criar primeira proposta
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Resumo Financeiro</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Valor Total Aprovado</span>
                </div>
                <span className="font-semibold text-green-600">
                  R$ {totalValue.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-gray-700">Propostas Pendentes</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {proposals.filter(p => p.status === 'enviada').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Taxa de Aprovação</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {Math.round((proposals.filter(p => p.status === 'aprovada').length / proposals.length) * 100) || 0}%
                </span>
              </div>
            </div>
            
            {/* Status Distribution */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Distribuição por Status</h4>
              <div className="space-y-2">
                {['rascunho', 'enviada', 'aprovada', 'recusada'].map((status) => {
                  const count = proposals.filter(p => p.status === status).length;
                  const percentage = proposals.length > 0 ? (count / proposals.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <StatusBadge status={status as any} />
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">{count}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;