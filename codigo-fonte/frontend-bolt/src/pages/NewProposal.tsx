import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Save, Send, Download } from 'lucide-react';
import { getClients, getServices, getProducts, saveProposal } from '../utils/storage';
import { generateProposalPDF } from '../utils/pdfGenerator';
import { Client, Service, Product, Proposal, ProposalItem, ProposalProductItem, ProposalWithDetails } from '../types';

const NewProposal: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    discount: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: ''
  });
  
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [productItems, setProductItems] = useState<ProposalProductItem[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      const [clientsData, servicesData, productsData] = await Promise.all([
        getClients(),
        getServices(),
        getProducts()
      ]);
      setClients(clientsData);
      setServices(servicesData);
      setProducts(productsData);
    };
    loadData();
  }, []);
  
  const addItem = () => {
    setItems([...items, {
      serviceId: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };
  
  const addProductItem = () => {
    setProductItems([...productItems, {
      productId: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };
  
  const updateItem = (index: number, field: keyof ProposalItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'serviceId') {
      const service = services.find(s => s.id === value);
      if (service) {
        newItems[index].unitPrice = service.price;
        newItems[index].total = newItems[index].quantity * service.price;
      }
    } else if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };
  
  const updateProductItem = (index: number, field: keyof ProposalProductItem, value: string | number) => {
    const newItems = [...productItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unitPrice = product.price;
        newItems[index].total = newItems[index].quantity * product.price;
      }
    } else if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setProductItems(newItems);
  };
  
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const removeProductItem = (index: number) => {
    setProductItems(productItems.filter((_, i) => i !== index));
  };
  
  const servicesSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  const productsSubtotal = productItems.reduce((sum, item) => sum + item.total, 0);
  const subtotal = servicesSubtotal + productsSubtotal;
  const total = subtotal - formData.discount;
  
  const generateProposalNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PROP-${year}${month}${day}-${random}`;
  };
  
  const handleSave = async (status: 'rascunho' | 'enviada') => {
    if (!formData.clientId || !formData.title || (items.length === 0 && productItems.length === 0)) {
      alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos um serviço ou produto.');
      return;
    }
    
    const proposal: Proposal = {
      id: Date.now().toString(),
      clientId: formData.clientId,
      number: generateProposalNumber(),
      title: formData.title,
      description: formData.description,
      items,
      productItems,
      subtotal,
      discount: formData.discount,
      total,
      status,
      validUntil: new Date(formData.validUntil),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: formData.notes
    };
    
    await saveProposal(proposal);
    
    if (status === 'enviada') {
      alert('Proposta enviada com sucesso!');
    } else {
      alert('Proposta salva como rascunho!');
    }
    
    navigate('/proposals');
  };
  
  const handleGeneratePDF = async () => {
    if (!formData.clientId || !formData.title || (items.length === 0 && productItems.length === 0)) {
      alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos um serviço ou produto.');
      return;
    }
    
    const client = clients.find(c => c.id === formData.clientId);
    if (!client) return;
    
    const proposalWithDetails: ProposalWithDetails = {
      id: 'temp',
      clientId: formData.clientId,
      number: generateProposalNumber(),
      title: formData.title,
      description: formData.description,
      items,
      productItems,
      subtotal,
      discount: formData.discount,
      total,
      status: 'rascunho',
      validUntil: new Date(formData.validUntil),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: formData.notes,
      client,
      services,
      products
    };
    
    generateProposalPDF(proposalWithDetails);
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Proposta</h1>
        <p className="text-gray-600">Crie uma nova proposta comercial para seus clientes</p>
      </div>
      
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.company} - {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Válida até *
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Proposta *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Proposta para Infraestrutura de TI"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Descreva os objetivos e escopo da proposta..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Services */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Serviços</h2>
          <button
            onClick={addItem}
            className="inline-flex items-center px-3 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Serviço
          </button>
        </div>
        
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => {
              const service = services.find(s => s.id === item.serviceId);
              return (
                <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serviço
                    </label>
                    <select
                      value={item.serviceId}
                      onChange={(e) => updateItem(index, 'serviceId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.category}
                        </option>
                      ))}
                    </select>
                    {service && (
                      <p className="text-xs text-gray-500 mt-1">
                        {service.description} (Unidade: {service.unit})
                      </p>
                    )}
                  </div>
                  
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qtd
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Unit.
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                      R$ {item.total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-2">Nenhum serviço adicionado</p>
            <button
              onClick={addItem}
              className="text-cyan-600 hover:text-cyan-500 font-medium"
            >
              Adicionar primeiro serviço
            </button>
          </div>
        )}
        
        {items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal Serviços:</span>
              <span className="font-medium text-gray-900">R$ {servicesSubtotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Produtos</h2>
          <button
            onClick={addProductItem}
            className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Produto
          </button>
        </div>
        
        {productItems.length > 0 ? (
          <div className="space-y-4">
            {productItems.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produto
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateProductItem(index, 'productId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione um produto</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.category}
                        </option>
                      ))}
                    </select>
                    {product && (
                      <p className="text-xs text-gray-500 mt-1">
                        {product.description} (Unidade: {product.unit})
                        {product.brand && ` - ${product.brand}`}
                        {product.model && ` ${product.model}`}
                      </p>
                    )}
                  </div>
                  
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qtd
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateProductItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Unit.
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateProductItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900">
                      R$ {item.total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <button
                      onClick={() => removeProductItem(index)}
                      className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
            <p className="text-gray-500 mb-2">Nenhum produto adicionado</p>
            <button
              onClick={addProductItem}
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Adicionar primeiro produto
            </button>
          </div>
        )}
        
        {productItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal Produtos:</span>
              <span className="font-medium text-gray-900">R$ {productsSubtotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Totals and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Observações adicionais, termos, condições..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Totais</h3>
            <div className="space-y-3">
              {servicesSubtotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Serviços:</span>
                  <span className="font-medium">R$ {servicesSubtotal.toFixed(2)}</span>
                </div>
              )}
              
              {productsSubtotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Produtos:</span>
                  <span className="font-medium">R$ {productsSubtotal.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Desconto:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={subtotal}
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                  />
                </div>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-cyan-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleGeneratePDF}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Gerar PDF
          </button>
          
          <button
            onClick={() => handleSave('rascunho')}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </button>
          
          <button
            onClick={() => handleSave('enviada')}
            className="inline-flex items-center justify-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Proposta
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProposal;