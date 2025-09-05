import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    'Infraestrutura de TI',
    'Cabeamento Estruturado',
    'Helpdesk e Suporte',
    'Serviços em Nuvem',
    'Backup Corporativo',
    'Segurança da Informação',
    'Consultoria em TI',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tecsolutions-primary to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Estamos prontos para ajudar sua empresa a alcançar o próximo nível tecnológico
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-tecsolutions-primary mb-8">
                Fale Conosco
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-tecsolutions-accent bg-opacity-10 rounded-lg p-3 mr-4">
                    <Phone className="w-6 h-6 text-tecsolutions-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Telefone</h3>
                    <p className="text-gray-600">(11) 2306-3144</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-tecsolutions-accent bg-opacity-10 rounded-lg p-3 mr-4">
                    <Mail className="w-6 h-6 text-tecsolutions-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">E-mail</h3>
                    <p className="text-gray-600">contato@tecsolutions.com.br</p>
                    <p className="text-gray-600">comercial@tecsolutions.com.br</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-tecsolutions-accent bg-opacity-10 rounded-lg p-3 mr-4">
                    <MapPin className="w-6 h-6 text-tecsolutions-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Endereço</h3>
                    <p className="text-gray-600">Rua Campos Sales, 303</p>
                    <p className="text-gray-600">Sala 703-A, Centro</p>
                    <p className="text-gray-600">Barueri/SP - CEP 06401-000</p>
                    <p className="text-gray-600 mt-2">Atendemos toda a Grande São Paulo</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-tecsolutions-accent bg-opacity-10 rounded-lg p-3 mr-4">
                    <Clock className="w-6 h-6 text-tecsolutions-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Horário de Atendimento</h3>
                    <p className="text-gray-600">Segunda a Sexta: 08:00 - 18:00</p>
                    <p className="text-tecsolutions-accent font-medium">Suporte 24/7 para clientes premium</p>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-tecsolutions-primary mb-4">
                  Por que escolher a TecSolutions?
                </h3>
                <ul className="space-y-3">
                  {[
                    'Mais de 17 anos de experiência no mercado',
                    'Equipe técnica certificada e especializada',
                    'Atendimento personalizado e consultivo',
                    'Soluções sob medida para sua empresa',
                    'Suporte técnico de qualidade',
                    'Preços competitivos e transparentes'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-tecsolutions-primary mb-6">
                  Solicite um Orçamento
                </h3>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Mensagem Enviada!
                    </h4>
                    <p className="text-gray-600">
                      Obrigado pelo contato. Retornaremos em breve!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tecsolutions-accent focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tecsolutions-accent focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Empresa
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tecsolutions-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tecsolutions-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Serviço de Interesse
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tecsolutions-accent focus:border-transparent"
                      >
                        <option value="">Selecione um serviço</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tecsolutions-accent focus:border-transparent"
                        placeholder="Descreva suas necessidades ou dúvidas..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-tecsolutions-primary text-white text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tecsolutions-primary mb-4">
              Nossa Localização
            </h2>
            <p className="text-xl text-gray-600">
              TecSolutions Informática LTDA - Barueri/SP
            </p>
          </div>
          
          <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Rua Campos Sales, 303 - Sala 703-A</p>
              <p className="text-gray-500">Centro, Barueri/SP - CEP 06401-000</p>
              <p className="text-gray-500 mt-2">Telefone: (11) 2306-3144</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;