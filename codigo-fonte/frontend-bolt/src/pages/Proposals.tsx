import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download, 
  Mail,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { getProposals, getClients, deleteProposal } from '../utils/storage';
import { Proposal, Client } from '../types';
import StatusBadge from '../components/StatusBadge';

const Proposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const loadData = async () => {
      const [proposalsData, clientsData] = await Promise.all([
        getProposals(),
        getClients()
      ]);
      setProposals(proposalsData);
      setClients(clientsData);
    };
    loadData();
  }, []);
  
  const filteredProposals = proposals.filter(proposal => {
    const client = clients.find(c => c.id === proposal.clientId);
    const matchesSearch = 
      proposal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta?')) {
      await deleteProposal(id);
      const proposalsData = await getProposals();
      setProposals(proposalsData);
    }
  };
  
  const handleSendEmail = (proposal: Proposal) => {
    const client = clients.find(c => c.id === proposal.clientId);
    if (client) {
      const subject = `Proposta Comercial - ${proposal.number}`;
      const body = `Prezado(a) ${client.name},\n\nSegue em anexo nossa proposta comercial.\n\nAtenciosamente,\nEquipe TecSolutions`;
      window.open(`mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propostas</h1>
          <p className="text-gray-600">Gerencie suas propostas comerciais</p>
        </div>
        <Link
          to="/proposals/new"
          className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Proposta
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por número, título ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="rascunho">Rascunho</option>
              <option value="enviada">Enviada</option>
              <option value="aprovada">Aprovada</option>
              <option value="recusada">Recusada</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Proposals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredProposals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProposals.map((proposal) => {
                  const client = clients.find(c => c.id === proposal.clientId);
                  return (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {proposal.number}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {proposal.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client?.company || 'Cliente não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {proposal.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={proposal.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSendEmail(proposal)}
                            className="text-blue-600 hover:text-blue-500 p-1"
                            title="Enviar por email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/proposals/${proposal.id}/edit`}
                            className="text-gray-600 hover:text-gray-500 p-1"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(proposal.id)}
                            className="text-red-600 hover:text-red-500 p-1"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma proposta encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie sua primeira proposta para começar'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/proposals/new"
                className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar primeira proposta
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;