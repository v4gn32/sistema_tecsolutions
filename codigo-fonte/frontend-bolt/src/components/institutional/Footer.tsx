import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-tecsolutions-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TecSolutions</h3>
            <p className="text-gray-300 mb-4">
              Soluções em Tecnologia da Informação desde 2007. 
              Oferecemos serviços completos de TI com foco em segurança, 
              desempenho e confiabilidade.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Infraestrutura de TI</li>
              <li>Cabeamento Estruturado</li>
              <li>Helpdesk e Suporte</li>
              <li>Serviços em Nuvem</li>
              <li>Backup Corporativo</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(11) 2306-3144</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contato@tecsolutions.com.br</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <div>
                  <p>Rua Campos Sales, 303</p>
                  <p>Sala 703-A, Centro</p>
                  <p>Barueri/SP - CEP 06401-000</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm">TecSolutions Informática LTDA</p>
                <p className="text-sm">CNPJ: 09.385.049/0001-84</p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horário</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <div>
                  <p>Segunda a Sexta</p>
                  <p className="text-sm">08:00 - 18:00</p>
                </div>
              </div>
              <div className="mt-3">
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2007 TecSolutions. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;