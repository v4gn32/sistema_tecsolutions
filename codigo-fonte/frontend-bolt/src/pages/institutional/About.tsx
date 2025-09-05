import React from 'react';
import { Shield, Target, Users, Award, Lightbulb, Heart } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Transparência',
      description: 'Comunicação clara e honesta em todos os projetos e relacionamentos.'
    },
    {
      icon: Target,
      title: 'Excelência',
      description: 'Busca constante pela qualidade superior em cada solução entregue.'
    },
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Sempre atualizados com as mais recentes tecnologias do mercado.'
    },
    {
      icon: Users,
      title: 'Parceria',
      description: 'Relacionamento duradouro baseado em confiança e resultados.'
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Compromisso com a entrega de soluções robustas e confiáveis.'
    },
    {
      icon: Heart,
      title: 'Dedicação',
      description: 'Comprometimento total com o sucesso dos nossos clientes.'
    }
  ];

  const timeline = [
    {
      year: '2007',
      title: 'Fundação da TecSolutions',
      description: 'Início das atividades com foco em suporte técnico e manutenção de computadores.'
    },
    {
      year: '2010',
      title: 'Expansão dos Serviços',
      description: 'Ampliação para serviços de infraestrutura de TI e cabeamento estruturado.'
    },
    {
      year: '2015',
      title: 'Era da Nuvem',
      description: 'Especialização em serviços de cloud computing e migração para nuvem.'
    },
    {
      year: '2020',
      title: 'Transformação Digital',
      description: 'Foco em soluções de transformação digital e trabalho remoto.'
    },
    {
      year: '2024',
      title: 'Inovação Contínua',
      description: 'Mais de 500 clientes atendidos e constante evolução tecnológica.'
    },
    {
      year: '2025',
      title: 'Expansão e Modernização',
      description: 'Ampliação dos serviços e implementação de novas tecnologias para melhor atender nossos clientes.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tecsolutions-primary to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a TecSolutions
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Conheça nossa história, valores e compromisso com a excelência em tecnologia
            </p>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-tecsolutions-primary mb-6">
                Nossa História
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-6">
                  A TecSolutions é uma empresa especializada em soluções de tecnologia da informação, 
                  atuando no mercado desde 2007. Com foco na prestação de serviços de TI, oferecemos 
                  soluções completas que garantem segurança, desempenho, confiabilidade e tranquilidade 
                  para nossos clientes.
                </p>
                <p>
                  Nosso compromisso é com a transparência, a excelência e a inovação em cada projeto 
                  entregue. Buscamos sempre proporcionar a melhor experiência tecnológica, agregando 
                  valor real ao negócio de nossos parceiros.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-tecsolutions-accent to-cyan-400 rounded-2xl p-8 text-tecsolutions-primary">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">17+</div>
                  <div className="text-sm font-medium">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-sm font-medium">Clientes Atendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <div className="text-sm font-medium">Uptime Garantido</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm font-medium">Suporte Premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tecsolutions-primary mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que guiam nossa empresa e definem nossa cultura organizacional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-tecsolutions-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-tecsolutions-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-tecsolutions-primary mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tecsolutions-primary mb-4">
              Nossa Trajetória
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Marcos importantes da nossa jornada de crescimento e evolução
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-tecsolutions-accent hidden lg:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-tecsolutions-accent">
                      <div className="text-2xl font-bold text-tecsolutions-primary mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <div className="w-4 h-4 bg-tecsolutions-accent rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="hidden lg:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-tecsolutions-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Nossa Equipe
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Profissionais especializados e certificados, prontos para atender 
            suas necessidades tecnológicas com excelência e dedicação.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-tecsolutions-accent mb-2">15+</div>
              <div className="text-lg">Profissionais Certificados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tecsolutions-accent mb-2">50+</div>
              <div className="text-lg">Certificações Técnicas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tecsolutions-accent mb-2">100%</div>
              <div className="text-lg">Dedicação aos Clientes</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;