import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Clock,
  Monitor,
  Wrench,
  Building,
  Calendar,
  User
} from 'lucide-react';
import { getClients, getServiceRecordsByClient, saveServiceRecord, deleteServiceRecord } from '../utils/storage';
import { Client, ServiceRecord } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ServiceRecordsPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    type: 'remote' as ServiceRecord['type'],
    date: new Date().toISOString().split('T')[0],
    description: '',
    services: [] as string[],
    arrivalTime: '',
    departureTime: '',
    lunchBreak: false,
    deviceReceived: '',
    deviceReturned: '',
    labServices: [] as string[],
    thirdPartyCompany: '',
    sentDate: '',
    returnedDate: '',
    cost: 0
  });

  const serviceTypes = [
    { value: 'remote', label: 'Atendimento Remoto', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
    { value: 'onsite', label: 'Atendimento Presencial', icon: User, color: 'bg-green-100 text-green-800' },
    { value: 'laboratory', label: 'Serviços de Laboratório', icon: Wrench, color: 'bg-purple-100 text-purple-800' },
    { value: 'third_party', label: 'Serviços de Terceiros', icon: Building, color: 'bg-orange-100 text-orange-800' }
  ];

  const commonServices = [
    'Manutenção preventiva',
    'Configuração de novo computador',
    'Instalação e configuração de impressora',
    'Revisão de rede',
    'Atualização de sistema',
    'Instalação de software',
    'Backup de dados',
    'Limpeza de vírus',
    'Configuração de email',
    'Suporte técnico geral'
  ];

  const labServices = [
    'Formatação completa',
    'Troca de HD/SSD',
    'Upgrade de memória',
    'Limpeza física',
    'Troca de fonte',
    'Reparo de placa mãe',
    'Diagnóstico completo',
    'Recuperação de dados'
  ];
  
  useEffect(() => {
    if (clientId) {
      const loadData = async () => {
        const clients = await getClients();
        const foundClient = clients.find(c => c.id === clientId);
        setClient(foundClient || null);
        const records = await getServiceRecordsByClient(clientId);
        setRecords(records);
      };
      loadData();
    }
  }, [clientId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId || !user) return;
    
    let totalHours = 0;
    if (formData.type === 'onsite' && formData.arrivalTime && formData.departureTime) {
      totalHours = calculateTotalHours(formData.arrivalTime, formData.departureTime, formData.lunchBreak);
    }
    
    const record: ServiceRecord = {
      id: editingRecord?.id || Date.now().toString(),
      clientId,
      type: formData.type,
      date: new Date(formData.date),
      description: formData.description,
      services: formData.type === 'laboratory' ? formData.labServices : formData.services,
      arrivalTime: formData.type === 'onsite' ? formData.arrivalTime : undefined,
      departureTime: formData.type === 'onsite' ? formData.departureTime : undefined,
      lunchBreak: formData.type === 'onsite' ? formData.lunchBreak : undefined,
      totalHours: formData.type === 'onsite' ? totalHours : undefined,
      deviceReceived: formData.type === 'laboratory' && formData.deviceReceived ? new Date(formData.deviceReceived) : undefined,
      deviceReturned: formData.type === 'laboratory' && formData.deviceReturned ? new Date(formData.deviceReturned) : undefined,
      labServices: formData.type === 'laboratory' ? formData.labServices : undefined,
      thirdPartyCompany: formData.type === 'third_party' ? formData.thirdPartyCompany : undefined,
      sentDate: formData.type === 'third_party' && formData.sentDate ? new Date(formData.sentDate) : undefined,
      returnedDate: formData.type === 'third_party' && formData.returnedDate ? new Date(formData.returnedDate) : undefined,
      cost: formData.type === 'third_party' ? formData.cost : undefined,
      createdAt: editingRecord?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: user.id
    };
    
    await saveServiceRecord(record);
    const records = await getServiceRecordsByClient(clientId);
    setRecords(records);
    setShowModal(false);
    resetForm();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de atendimento?')) {
      await deleteServiceRecord(id);
      if (clientId) {
        const records = await getServiceRecordsByClient(clientId);
        setRecords(records);
      }
    }
  };
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const resetForm = () => {
    setFormData({
      type: 'remote',
      date: new Date().toISOString().split('T')[0],
      description: '',
      services: [],
      arrivalTime: '',
      departureTime: '',
      lunchBreak: false,
      deviceReceived: '',
      deviceReturned: '',
      labServices: [],
      thirdPartyCompany: '',
      sentDate: '',
      returnedDate: '',
      cost: 0
    });
    setEditingRecord(null);
  };

  const calculateTotalHours = (arrival: string, departure: string, lunchBreak: boolean): number => {
    if (!arrival || !departure) return 0;
    
    const arrivalTime = new Date(`2000-01-01T${arrival}`);
    const departureTime = new Date(`2000-01-01T${departure}`);
    
    let diffMs = departureTime.getTime() - arrivalTime.getTime();
    if (lunchBreak) {
      diffMs -= 60 * 60 * 1000; // Subtract 1 hour for lunch
    }
    
    return Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours
  };
  
  const handleEdit = (record: ServiceRecord) => {
    setEditingRecord(record);
    setFormData({
      type: record.type,
      date: new Date(record.date).toISOString().split('T')[0],
      description: record.description,
      services: record.services || [],
      arrivalTime: record.arrivalTime || '',
      departureTime: record.departureTime || '',
      lunchBreak: record.lunchBreak || false,
      deviceReceived: record.deviceReceived ? new Date(record.deviceReceived).toISOString().split('T')[0] : '',
      deviceReturned: record.deviceReturned ? new Date(record.deviceReturned).toISOString().split('T')[0] : '',
      labServices: record.labServices || [],
      thirdPartyCompany: record.thirdPartyCompany || '',
      sentDate: record.sentDate ? new Date(record.sentDate).toISOString().split('T')[0] : '',
      returnedDate: record.returnedDate ? new Date(record.returnedDate).toISOString().split('T')[0] : '',
      cost: record.cost || 0
    });
    setShowModal(true);
  };

  const handleServiceToggle = (service: string, isLab: boolean = false) => {
    const field = isLab ? 'labServices' : 'services';
    const currentServices = formData[field];
    
    if (currentServices.includes(service)) {
      setFormData({
        ...formData,
        [field]: currentServices.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentServices, service]
      });
    }
  };

  const getTypeConfig = (type: string) => {
    return serviceTypes.find(t => t.value === type) || serviceTypes[0];
  };
  
  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Cliente não encontrado</h3>
        <Link to="/clients" className="text-cyan-600 hover:text-cyan-500">
          Voltar para Clientes
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/clients"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lançamentos de Atendimento</h1>
            <p className="text-gray-600">{client.company} - {client.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Atendimento
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por descrição ou serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">Todos os Tipos</option>
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const typeConfig = getTypeConfig(record.type);
          const Icon = typeConfig.icon;
          
          return (
            <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-lg p-3 mr-4">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <p className="text-gray-900 font-medium">{record.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Services */}
              {record.services && record.services.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Serviços Executados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.services.map((service, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Type-specific information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {record.type === 'onsite' && (
                  <>
                    <div>
                      <span className="font-medium text-gray-700">Chegada:</span>
                      <p className="text-gray-600">{record.arrivalTime}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Saída:</span>
                      <p className="text-gray-600">{record.departureTime}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Almoço:</span>
                      <p className="text-gray-600">{record.lunchBreak ? 'Sim (1h)' : 'Não'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total de Horas:</span>
                      <p className="text-gray-600 font-semibold">{record.totalHours?.toFixed(1)}h</p>
                    </div>
                  </>
                )}
                
                {record.type === 'laboratory' && (
                  <>
                    {record.deviceReceived && (
                      <div>
                        <span className="font-medium text-gray-700">Recebido em:</span>
                        <p className="text-gray-600">{new Date(record.deviceReceived).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {record.deviceReturned && (
                      <div>
                        <span className="font-medium text-gray-700">Devolvido em:</span>
                        <p className="text-gray-600">{new Date(record.deviceReturned).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </>
                )}
                
                {record.type === 'third_party' && (
                  <>
                    <div>
                      <span className="font-medium text-gray-700">Empresa:</span>
                      <p className="text-gray-600">{record.thirdPartyCompany}</p>
                    </div>
                    {record.sentDate && (
                      <div>
                        <span className="font-medium text-gray-700">Enviado em:</span>
                        <p className="text-gray-600">{new Date(record.sentDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {record.returnedDate && (
                      <div>
                        <span className="font-medium text-gray-700">Retornado em:</span>
                        <p className="text-gray-600">{new Date(record.returnedDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {record.cost && record.cost > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Custo:</span>
                        <p className="text-gray-600">R$ {record.cost.toFixed(2)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum atendimento encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || typeFilter !== 'all'
              ? 'Tente ajustar os filtros de busca' 
              : 'Registre o primeiro atendimento para começar'
            }
          </p>
          {!searchTerm && typeFilter === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Registrar primeiro atendimento
            </button>
          )}
        </div>
      )}
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRecord ? 'Editar Atendimento' : 'Novo Atendimento'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Atendimento *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ServiceRecord['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  >
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Descreva o atendimento realizado..."
                  required
                />
              </div>
              
              {/* Onsite specific fields */}
              {formData.type === 'onsite' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Atendimento Presencial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horário de Chegada *
                      </label>
                      <input
                        type="time"
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horário de Saída *
                      </label>
                      <input
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.lunchBreak}
                          onChange={(e) => setFormData({ ...formData, lunchBreak: e.target.checked })}
                          className="mr-2 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-700">1 hora de almoço</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.arrivalTime && formData.departureTime && (
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Total de Horas: {calculateTotalHours(formData.arrivalTime, formData.departureTime, formData.lunchBreak).toFixed(1)}h
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Laboratory specific fields */}
              {formData.type === 'laboratory' && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Serviços de Laboratório</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Recebimento
                      </label>
                      <input
                        type="date"
                        value={formData.deviceReceived}
                        onChange={(e) => setFormData({ ...formData, deviceReceived: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Devolução
                      </label>
                      <input
                        type="date"
                        value={formData.deviceReturned}
                        onChange={(e) => setFormData({ ...formData, deviceReturned: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serviços de Laboratório
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {labServices.map((service) => (
                        <label key={service} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labServices.includes(service)}
                            onChange={() => handleServiceToggle(service, true)}
                            className="mr-2 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Third party specific fields */}
              {formData.type === 'third_party' && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Serviços de Terceiros</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa Terceirizada *
                      </label>
                      <input
                        type="text"
                        value={formData.thirdPartyCompany}
                        onChange={(e) => setFormData({ ...formData, thirdPartyCompany: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Nome da assistência técnica"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custo (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Envio
                      </label>
                      <input
                        type="date"
                        value={formData.sentDate}
                        onChange={(e) => setFormData({ ...formData, sentDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Retorno
                      </label>
                      <input
                        type="date"
                        value={formData.returnedDate}
                        onChange={(e) => setFormData({ ...formData, returnedDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Services (for remote and onsite) */}
              {(formData.type === 'remote' || formData.type === 'onsite') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviços Executados
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonServices.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="mr-2 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
                >
                  {editingRecord ? 'Atualizar' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecordsPage;