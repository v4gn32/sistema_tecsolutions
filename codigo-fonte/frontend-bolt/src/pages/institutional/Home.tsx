import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Users, 
  Award,
  Server,
  Cloud,
  Headphones,
  Cable,
  HardDrive,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      icon: Server,
      title: 'Infraestrutura de TI',
      description: 'Planejamento e implementação de infraestrutura tecnológica completa.'
    },
    {
      icon: Cable,
      title: 'Cabeamento Estruturado',
      description: 'Instalação de rede estruturada com certificação e garantia.'
    },
    {
      icon: Headphones,
      title: 'Helpdesk e Suporte',
      description: 'Suporte técnico especializado 24/7 para sua empresa.'
    },
    {
      icon: Cloud,
      title: 'Serviços em Nuvem',
      description: 'Migração e gestão de serviços na nuvem com segurança.'
    },
    {
      icon: HardDrive,
      title: 'Backup Corporativo',
      description: 'Soluções de backup automatizado e recuperação de dados.'
    }
  ];

  const features = [
    'Mais de 17 anos de experiência',
    'Equipe técnica certificada',
    'Suporte presencial ou remoto',
    'Soluções personalizadas'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tecsolutions-primary via-blue-800 to-tecsolutions-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Soluções em
                <span className="text-tecsolutions-accent block">
                  Tecnologia da Informação
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Desde 2007 oferecemos soluções completas de TI que garantem 
                segurança, desempenho e confiabilidade para sua empresa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contato"
                  className="inline-flex items-center px-8 py-4 bg-tecsolutions-accent text-tecsolutions-primary text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
                >
                  Solicitar Orçamento
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/servicos"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-tecsolutions-primary transition-all duration-200"
                >
                  Nossos Serviços
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-tecsolutions-accent flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Award, number: '17+', label: 'Anos de Experiência' },
              { icon: Users, number: '500+', label: 'Clientes Atendidos' },
              { icon: Shield, number: '99.9%', label: 'Uptime Garantido' },
              { icon: Zap, number: '24/7', label: 'Suporte Premium' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-tecsolutions-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-tecsolutions-accent" />
                  </div>
                  <div className="text-3xl font-bold text-tecsolutions-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tecsolutions-primary mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos soluções completas em tecnologia da informação, 
              contato@tecsolutions.com.br | (11) 2306-3144
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <div className="bg-tecsolutions-accent bg-opacity-10 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-tecsolutions-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-tecsolutions-primary mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/servicos"
              className="inline-flex items-center px-8 py-4 bg-tecsolutions-primary text-white text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-200"
            >
              Ver Todos os Serviços
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-tecsolutions-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Transformar sua TI?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa 
            a alcançar o próximo nível tecnológico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="inline-flex items-center px-8 py-4 bg-tecsolutions-accent text-tecsolutions-primary text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
            >
              Fale Conosco
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

export default Home;