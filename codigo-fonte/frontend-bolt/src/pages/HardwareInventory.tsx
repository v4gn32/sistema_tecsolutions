import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2, Monitor, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { getClients, getHardwareByClient, saveHardwareInventory, deleteHardwareInventory } from '../utils/storage';
import { Client, HardwareInventory } from '../types';

const HardwareInventoryPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [inventory, setInventory] = useState<HardwareInventory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HardwareInventory | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    processor: '',
    memory: '',
    storage: '',
    operatingSystem: '',
    deviceName: '',
    office: '',
    antivirus: '',
    username: '',
    password: '',
    pin: '',
    warranty: ''
  });
  
  useEffect(() => {
    if (clientId) {
      const loadData = async () => {
        const clients = await getClients();
        const foundClient = clients.find(c => c.id === clientId);
        setClient(foundClient || null);
        const inventory = await getHardwareByClient(clientId);
        setInventory(inventory);
      };
      loadData();
    }
  }, [clientId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) return;
    
    const hardware: HardwareInventory = {
      id: editingItem?.id || Date.now().toString(),
      clientId,
      ...formData,
      createdAt: editingItem?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    await saveHardwareInventory(hardware);
    const inventory = await getHardwareByClient(clientId);
    setInventory(inventory);
    setShowModal(false);
    resetForm();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do inventário?')) {
      await deleteHardwareInventory(id);
      if (clientId) {
        const inventory = await getHardwareByClient(clientId);
        setInventory(inventory);
      }
    }
  };
  
  const filteredInventory = inventory.filter(item =>
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      serialNumber: '',
      processor: '',
      memory: '',
      storage: '',
      operatingSystem: '',
      deviceName: '',
      office: '',
      antivirus: '',
      username: '',
      password: '',
      pin: '',
      warranty: ''
    });
    setEditingItem(null);
  };
  
  const handleEdit = (item: HardwareInventory) => {
    setEditingItem(item);
    setFormData({
      brand: item.brand,
      model: item.model,
      serialNumber: item.serialNumber,
      processor: item.processor,
      memory: item.memory,
      storage: item.storage,
      operatingSystem: item.operatingSystem,
      deviceName: item.deviceName,
      office: item.office,
      antivirus: item.antivirus,
      username: item.username,
      password: item.password,
      pin: item.pin,
      warranty: item.warranty
    });
    setShowModal(true);
  };
  
  const togglePasswordVisibility = (itemId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">Inventário de Hardware</h1>
            <p className="text-gray-600">{client.company} - {client.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Item
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, dispositivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.brand} {item.model}
                  </h3>
                  <p className="text-sm text-gray-600">{item.deviceName}</p>
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
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Série:</span>
                <p className="text-gray-600">{item.serialNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Processador:</span>
                <p className="text-gray-600">{item.processor}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Memória:</span>
                <p className="text-gray-600">{item.memory}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Armazenamento:</span>
                <p className="text-gray-600">{item.storage}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">SO:</span>
                <p className="text-gray-600">{item.operatingSystem}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Office:</span>
                <p className="text-gray-600">{item.office}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Antivírus:</span>
                <p className="text-gray-600">{item.antivirus}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Garantia:</span>
                <p className="text-gray-600">{item.warranty}</p>
              </div>
            </div>
            
            {/* Credentials Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Usuário:</span>
                  <span className="text-gray-600">{item.username}</span>
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
                {item.pin && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">PIN:</span>
                    <span className="text-gray-600">{item.pin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum item encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Tente ajustar o termo de busca' 
              : 'Adicione o primeiro item ao inventário'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar primeiro item
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
                {editingItem ? 'Editar Item' : 'Novo Item de Hardware'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Série *
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Dispositivo *
                  </label>
                  <input
                    type="text"
                    value={formData.deviceName}
                    onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processador
                  </label>
                  <input
                    type="text"
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Memória
                  </label>
                  <input
                    type="text"
                    value={formData.memory}
                    onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Armazenamento (HD)
                  </label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sistema Operacional
                  </label>
                  <input
                    type="text"
                    value={formData.operatingSystem}
                    onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office
                  </label>
                  <input
                    type="text"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Antivírus
                  </label>
                  <input
                    type="text"
                    value={formData.antivirus}
                    onChange={(e) => setFormData({ ...formData, antivirus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN
                  </label>
                  <input
                    type="text"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garantia
                </label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  placeholder="Ex: 12 meses, até 31/12/2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
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
                  className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
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

export default HardwareInventoryPage;