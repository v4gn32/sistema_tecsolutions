import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2, Code, ArrowLeft, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { getClients, getSoftwareByClient, saveSoftwareInventory, deleteSoftwareInventory } from '../utils/storage';
import { Client, SoftwareInventory } from '../types';

const SoftwareInventoryPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [inventory, setInventory] = useState<SoftwareInventory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SoftwareInventory | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    softwareName: '',
    softwareType: 'local' as SoftwareInventory['softwareType'],
    expirationAlert: '',
    monthlyValue: 0,
    annualValue: 0,
    userControl: 'none' as SoftwareInventory['userControl']
  });
  
  const softwareTypes = [
    { value: 'local', label: 'Software Local' },
    { value: 'cloud', label: 'Cloud/SaaS' },
    { value: 'subscription', label: 'Assinatura' },
    { value: 'license', label: 'Licença' },
    { value: 'outros', label: 'Outros' }
  ];
  
  const userControlTypes = [
    { value: 'none', label: 'Nenhum' },
    { value: 'ad_local', label: 'AD Local' },
    { value: 'cloud', label: 'Nuvem' }
  ];
  
  useEffect(() => {
    if (clientId) {
      const loadData = async () => {
        const clients = await getClients();
        const foundClient = clients.find(c => c.id === clientId);
        setClient(foundClient || null);
        const inventory = await getSoftwareByClient(clientId);
        setInventory(inventory);
      };
      loadData();
    }
  }, [clientId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) return;
    
    const software: SoftwareInventory = {
      id: editingItem?.id || Date.now().toString(),
      clientId,
      login: formData.login,
      password: formData.password,
      softwareName: formData.softwareName,
      softwareType: formData.softwareType,
      expirationAlert: formData.expirationAlert ? new Date(formData.expirationAlert) : new Date(),
      monthlyValue: formData.monthlyValue || undefined,
      annualValue: formData.annualValue || undefined,
      userControl: formData.userControl,
      createdAt: editingItem?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    await saveSoftwareInventory(software);
    const inventory = await getSoftwareByClient(clientId);
    setInventory(inventory);
    setShowModal(false);
    resetForm();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do inventário?')) {
      await deleteSoftwareInventory(id);
      if (clientId) {
        const inventory = await getSoftwareByClient(clientId);
        setInventory(inventory);
      }
    }
  };
  
  const filteredInventory = inventory.filter(item =>
    item.softwareName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.login.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({
      login: '',
      password: '',
      softwareName: '',
      softwareType: 'local',
      expirationAlert: '',
      monthlyValue: 0,
      annualValue: 0,
      userControl: 'none'
    });
    setEditingItem(null);
  };
  
  const handleEdit = (item: SoftwareInventory) => {
    setEditingItem(item);
    setFormData({
      login: item.login,
      password: item.password,
      softwareName: item.softwareName,
      softwareType: item.softwareType,
      expirationAlert: new Date(item.expirationAlert).toISOString().split('T')[0],
      monthlyValue: item.monthlyValue || 0,
      annualValue: item.annualValue || 0,
      userControl: item.userControl
    });
    setShowModal(true);
  };
  
  const togglePasswordVisibility = (itemId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  const isExpiringSoon = (expirationDate: Date) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };
  
  const isExpired = (expirationDate: Date) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    return expiration < today;
  };
  
  const getSoftwareTypeColor = (type: string) => {
    const colors = {
      local: 'bg-blue-100 text-blue-800',
      cloud: 'bg-purple-100 text-purple-800',
      subscription: 'bg-green-100 text-green-800',
      license: 'bg-orange-100 text-orange-800',
      outros: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.outros;
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
            <h1 className="text-2xl font-bold text-gray-900">Inventário de Software</h1>
            <p className="text-gray-600">{client.company} - {client.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Software
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome do software ou login..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInventory.map((item) => {
          const expiring = isExpiringSoon(item.expirationAlert);
          const expired = isExpired(item.expirationAlert);
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-lg p-3 mr-4">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.softwareName}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSoftwareTypeColor(item.softwareType)}`}>
                      {softwareTypes.find(t => t.value === item.softwareType)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Expiration Alert */}
              {(expired || expiring) && (
                <div className={`mb-4 p-3 rounded-lg flex items-center ${
                  expired ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
                }`}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {expired ? 'Expirado' : 'Expira em breve'} - {new Date(item.expirationAlert).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              {/* Credentials */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Login:</span>
                    <span className="text-gray-600">{item.login}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Senha:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        {showPasswords[item.id] ? item.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Vencimento:</span>
                  <p className="text-gray-600">{new Date(item.expirationAlert).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Controle de Usuários:</span>
                  <p className="text-gray-600">
                    {userControlTypes.find(t => t.value === item.userControl)?.label}
                  </p>
                </div>
                {item.monthlyValue && item.monthlyValue > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Valor Mensal:</span>
                    <p className="text-gray-600">R$ {item.monthlyValue.toFixed(2)}</p>
                  </div>
                )}
                {item.annualValue && item.annualValue > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Valor Anual:</span>
                    <p className="text-gray-600">R$ {item.annualValue.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum software encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Tente ajustar o termo de busca' 
              : 'Adicione o primeiro software ao inventário'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar primeiro software
            </button>
          )}
        </div>
      )}
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Editar Software' : 'Novo Software'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Software *
                </label>
                <input
                  type="text"
                  value={formData.softwareName}
                  onChange={(e) => setFormData({ ...formData, softwareName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Software *
                </label>
                <select
                  value={formData.softwareType}
                  onChange={(e) => setFormData({ ...formData, softwareType: e.target.value as SoftwareInventory['softwareType'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {softwareTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Login *
                  </label>
                  <input
                    type="text"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    value={formData.expirationAlert}
                    onChange={(e) => setFormData({ ...formData, expirationAlert: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Controle de Usuários
                  </label>
                  <select
                    value={formData.userControl}
                    onChange={(e) => setFormData({ ...formData, userControl: e.target.value as SoftwareInventory['userControl'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {userControlTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Mensal (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monthlyValue}
                    onChange={(e) => setFormData({ ...formData, monthlyValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Anual (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.annualValue}
                    onChange={(e) => setFormData({ ...formData, annualValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
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
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  {editingItem ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareInventoryPage;