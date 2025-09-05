import React from 'react';
import { 
  Server, 
  Cable, 
  Headphones, 
  Cloud, 
  HardDrive, 
  Shield,
  Monitor,
  Wifi,
  Database,
  Settings,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const mainServices = [
    {
      icon: Server,
      title: 'Infraestrutura de TI',
      description: 'Planejamento, implementação e manutenção de infraestrutura tecnológica completa para sua empresa.',
      features: [
        'Servidores físicos e virtuais',
        'Configuração de redes corporativas',
        'Implementação de Active Directory',
        'Manutenção preventiva e corretiva'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Cable,
      title: 'Cabeamento Estruturado',
      description: 'Instalação de rede estruturada com certificação, seguindo as melhores práticas do mercado.',
      features: [
        'Cabeamento Cat5e, Cat6 e Cat6A',
        'Certificação de rede',
        'Instalação de racks e patch panels',
        'Documentação completa'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Headphones,
      title: 'Helpdesk e Suporte',
      description: 'Suporte técnico especializado com diferentes níveis de atendimento para sua empresa.',
      features: [
        'Suporte remoto e presencial',
        'Atendimento de segunda a sexta',
        'Gestão de chamados',
        'SLA garantido',
        'Equipe técnica certificada'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Cloud,
      title: 'Serviços em Nuvem',
      description: 'Migração e gestão de serviços na nuvem com foco em segurança e performance.',
      features: [
        'Migração para AWS, Azure, Google Cloud',
        'Backup em nuvem',
        'Monitoramento de recursos',
        'Otimização de custos',
        'Segurança avançada'
      ],
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: HardDrive,
      title: 'Backup Corporativo',
      description: 'Soluções de backup automatizado e recuperação de dados com alta disponibilidade.',
      features: [
        'Backup automatizado',
        'Replicação de dados',
        'Teste de recuperação',
        'Armazenamento seguro',
        'Plano de disaster recovery'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Segurança da Informação',
      description: 'Proteção completa dos dados e sistemas da sua empresa contra ameaças digitais.',
      features: [
        'Firewall e antivírus corporativo',
        'Análise de vulnerabilidades',
        'Políticas de segurança',
        'Treinamento de usuários',
        'Compliance e auditoria'
      ],
      color: 'from-red-500 to-red-600'
    }
  ];

  const additionalServices = [
    { icon: Monitor, title: 'Consultoria em TI', description: 'Análise e planejamento estratégico de tecnologia' },
    { icon: Wifi, title: 'Redes Wireless', description: 'Implementação de redes Wi-Fi corporativas' },
    { icon: Database, title: 'Gestão de Banco de Dados', description: 'Administração e otimização de bancos de dados' },
    { icon: Settings, title: 'Automação de Processos', description: 'Automatização de rotinas e processos empresariais' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tecsolutions-primary to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Soluções completas em tecnologia da informação para impulsionar o crescimento da sua empresa
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tecsolutions-primary mb-4">
              Serviços Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos uma gama completa de serviços especializados em TI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className={`bg-gradient-to-r ${service.color} p-6`}>
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tecsolutions-primary mb-4">
              Serviços Complementares
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções adicionais para completar sua infraestrutura tecnológica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-tecsolutions-accent bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-tecsolutions-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-tecsolutions-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tecsolutions-primary mb-4">
              Nosso Processo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Metodologia comprovada para garantir o sucesso dos seus projetos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Análise', description: 'Avaliação completa das necessidades e infraestrutura atual' },
              { step: '02', title: 'Planejamento', description: 'Desenvolvimento de estratégia personalizada e cronograma' },
              { step: '03', title: 'Implementação', description: 'Execução do projeto com acompanhamento em tempo real' },
              { step: '04', title: 'Suporte', description: 'Manutenção contínua e suporte técnico especializado' }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-tecsolutions-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-tecsolutions-primary mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-tecsolutions-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como nossos serviços podem 
            transformar a tecnologia da sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="inline-flex items-center px-8 py-4 bg-tecsolutions-accent text-tecsolutions-primary text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
            >
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-tecsolutions-accent text-tecsolutions-accent text-lg font-semibold rounded-lg hover:bg-tecsolutions-accent hover:text-tecsolutions-primary transition-all duration-200"
            >
              Acessar Sistema
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;