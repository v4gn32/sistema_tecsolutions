import jsPDF from 'jspdf';
import { ProposalWithDetails } from '../types';

export const generateProposalPDF = (proposal: ProposalWithDetails): void => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = '#0D1F42'; // Azul escuro corporativo
  const accentColor = '#00E6E6';   // Cyan para destaques
  const textColor = '#333333';     // Texto principal
  const lightGray = '#F8F9FA';     // Fundo claro
  const mediumGray = '#6C757D';    // Texto secundário
  
  // Função para adicionar nova página se necessário
  const checkPageBreak = (currentY: number, requiredSpace: number = 20): number => {
    if (currentY + requiredSpace > 270) {
      doc.addPage();
      return 20;
    }
    return currentY;
  };
  
  // PÁGINA 1 - CAPA
  // Fundo da capa
  doc.setFillColor(13, 31, 66); // #0D1F42
  doc.rect(0, 0, 210, 297, 'F');
  
  // Logo/Nome da empresa (grande)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('TecSolutions', 105, 80, { align: 'center' });
  
  // Subtítulo da empresa
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Soluções em Tecnologia da Informação', 105, 95, { align: 'center' });
  
  // Linha decorativa
  doc.setDrawColor(0, 230, 230); // Cyan
  doc.setLineWidth(2);
  doc.line(60, 110, 150, 110);
  
  // Título da proposta
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPOSTA COMERCIAL', 105, 140, { align: 'center' });
  
  // Informações da proposta
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Proposta Nº: ${proposal.number}`, 105, 160, { align: 'center' });
  doc.text(`Data: ${new Date(proposal.createdAt).toLocaleDateString('pt-BR')}`, 105, 170, { align: 'center' });
  
  // Cliente
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE:', 105, 200, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(proposal.client.company, 105, 215, { align: 'center' });
  doc.text(proposal.client.name, 105, 225, { align: 'center' });
  
  // Rodapé da capa
  doc.setFontSize(10);
  doc.setTextColor(0, 230, 230);
  doc.text('contato@tecsolutions.com.br | (11) 2306-3144', 105, 280, { align: 'center' });
  
  // PÁGINA 2 - APRESENTAÇÃO DA EMPRESA
  doc.addPage();
  
  // Header da página
  doc.setFillColor(13, 31, 66);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TecSolutions', 20, 16);
  
  // Título da seção
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Sobre a TecSolutions', 20, 45);
  
  // Linha decorativa
  doc.setDrawColor(0, 230, 230);
  doc.setLineWidth(1);
  doc.line(20, 50, 190, 50);
  
  // Texto da apresentação
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const aboutText = `A TecSolutions é uma empresa especializada em soluções de tecnologia da informação, atuando no mercado desde 2007. Com foco na prestação de serviços de TI, oferecemos soluções completas que garantem segurança, desempenho, confiabilidade e tranquilidade para nossos clientes.

Nosso compromisso é com a transparência, a excelência e a inovação em cada projeto entregue. Buscamos sempre proporcionar a melhor experiência tecnológica, agregando valor real ao negócio de nossos parceiros.`;
  
  const aboutLines = doc.splitTextToSize(aboutText, 170);
  doc.text(aboutLines, 20, 65);
  
  // Seção de diferenciais
  let yPos = 110;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 31, 66);
  doc.text('Nossos Diferenciais:', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  
  const diferenciais = [
    '• Mais de 17 anos de experiência no mercado de TI',
    '• Equipe técnica especializada e certificada',
    '• Suporte técnico 24/7 para clientes premium',
    '• Soluções personalizadas para cada necessidade',
    '• Compromisso com prazos e qualidade',
    '• Parcerias estratégicas com grandes fornecedores'
  ];
  
  diferenciais.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 8;
  });
  
  // Seção de serviços
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 31, 66);
  doc.text('Áreas de Atuação:', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  
  const areas = [
    '• Infraestrutura de TI e Servidores',
    '• Suporte Técnico e Helpdesk',
    '• Soluções em Nuvem (Cloud Computing)',
    '• Backup e Recuperação de Dados',
    '• Cabeamento Estruturado',
    '• Consultoria em Tecnologia'
  ];
  
  areas.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 8;
  });
  
  // PÁGINA 3 - DADOS DO CLIENTE
  doc.addPage();
  
  // Header da página
  doc.setFillColor(13, 31, 66);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TecSolutions', 20, 16);
  
  // Título da seção
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente', 20, 45);
  
  // Linha decorativa
  doc.setDrawColor(0, 230, 230);
  doc.setLineWidth(1);
  doc.line(20, 50, 190, 50);
  
  // Card do cliente
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(20, 60, 170, 80, 5, 5, 'F');
  
  // Dados do cliente
  yPos = 75;
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Empresa:', 30, yPos);
  
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(proposal.client.company, 70, yPos);
  
  yPos += 12;
  doc.setTextColor(13, 31, 66);
  doc.setFont('helvetica', 'bold');
  doc.text('Contato:', 30, yPos);
  
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(proposal.client.name, 70, yPos);
  
  yPos += 12;
  doc.setTextColor(13, 31, 66);
  doc.setFont('helvetica', 'bold');
  doc.text('E-mail:', 30, yPos);
  
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(proposal.client.email, 70, yPos);
  
  yPos += 12;
  doc.setTextColor(13, 31, 66);
  doc.setFont('helvetica', 'bold');
  doc.text('Telefone:', 30, yPos);
  
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(proposal.client.phone, 70, yPos);
  
  if (proposal.client.cnpj) {
    yPos += 12;
    doc.setTextColor(13, 31, 66);
    doc.setFont('helvetica', 'bold');
    doc.text('CNPJ:', 30, yPos);
    
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    doc.text(proposal.client.cnpj, 70, yPos);
  }
  
  // Título e descrição da proposta
  yPos = 160;
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Proposta:', 20, yPos);
  
  yPos += 15;
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(proposal.title, 20, yPos);
  
  if (proposal.description) {
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(proposal.description, 170);
    doc.text(descLines, 20, yPos);
  }
  
  // PÁGINA 4+ - ITENS DA PROPOSTA
  doc.addPage();
  
  // Header da página
  doc.setFillColor(13, 31, 66);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TecSolutions', 20, 16);
  
  // Título da seção
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Itens da Proposta', 20, 45);
  
  // Linha decorativa
  doc.setDrawColor(0, 230, 230);
  doc.setLineWidth(1);
  doc.line(20, 50, 190, 50);
  
  yPos = 65;
  
  // Seção de Serviços
  if (proposal.items.length > 0) {
    doc.setTextColor(13, 31, 66);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVIÇOS', 20, yPos);
    
    yPos += 10;
    
    // Cabeçalho da tabela de serviços
    doc.setFillColor(13, 31, 66);
    doc.rect(20, yPos - 5, 170, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Descrição', 25, yPos + 2);
    doc.text('Qtd', 120, yPos + 2);
    doc.text('Valor Unit.', 140, yPos + 2);
    doc.text('Total', 170, yPos + 2);
    
    yPos += 15;
    
    // Itens de serviços
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    
    proposal.items.forEach((item, index) => {
      yPos = checkPageBreak(yPos, 25);
      
      const service = proposal.services.find(s => s.id === item.serviceId);
      if (service) {
        // Fundo alternado
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(20, yPos - 3, 170, 10, 'F');
        }
        
        const serviceName = doc.splitTextToSize(service.name, 90)[0];
        doc.setFontSize(9);
        doc.text(serviceName, 25, yPos + 2);
        
        // Descrição menor
        if (service.description) {
          const shortDesc = service.description.length > 60 
            ? service.description.substring(0, 60) + '...' 
            : service.description;
          doc.setFontSize(7);
          doc.setTextColor(108, 117, 125);
          doc.text(shortDesc, 25, yPos + 7);
          doc.setTextColor(51, 51, 51);
        }
        
        doc.setFontSize(9);
        doc.text(item.quantity.toString(), 125, yPos + 2);
        doc.text(`R$ ${item.unitPrice.toFixed(2)}`, 140, yPos + 2);
        doc.text(`R$ ${item.total.toFixed(2)}`, 165, yPos + 2);
        
        yPos += 12;
      }
    });
    
    yPos += 10;
  }
  
  // Seção de Produtos
  if (proposal.productItems.length > 0) {
    yPos = checkPageBreak(yPos, 30);
    
    doc.setTextColor(13, 31, 66);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUTOS', 20, yPos);
    
    yPos += 10;
    
    // Cabeçalho da tabela de produtos
    doc.setFillColor(0, 230, 230);
    doc.rect(20, yPos - 5, 170, 12, 'F');
    
    doc.setTextColor(13, 31, 66);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Descrição', 25, yPos + 2);
    doc.text('Qtd', 120, yPos + 2);
    doc.text('Valor Unit.', 140, yPos + 2);
    doc.text('Total', 170, yPos + 2);
    
    yPos += 15;
    
    // Itens de produtos
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    
    proposal.productItems.forEach((item, index) => {
      yPos = checkPageBreak(yPos, 25);
      
      const product = proposal.products.find(p => p.id === item.productId);
      if (product) {
        // Fundo alternado
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(20, yPos - 3, 170, 10, 'F');
        }
        
        const productName = doc.splitTextToSize(product.name, 90)[0];
        doc.setFontSize(9);
        doc.text(productName, 25, yPos + 2);
        
        // Marca e modelo
        if (product.brand || product.model) {
          doc.setFontSize(7);
          doc.setTextColor(108, 117, 125);
          const brandModel = `${product.brand || ''} ${product.model || ''}`.trim();
          doc.text(brandModel, 25, yPos + 7);
          doc.setTextColor(51, 51, 51);
        }
        
        doc.setFontSize(9);
        doc.text(item.quantity.toString(), 125, yPos + 2);
        doc.text(`R$ ${item.unitPrice.toFixed(2)}`, 140, yPos + 2);
        doc.text(`R$ ${item.total.toFixed(2)}`, 165, yPos + 2);
        
        yPos += 12;
      }
    });
    
    yPos += 10;
  }
  
  // Totais
  yPos = checkPageBreak(yPos, 50);
  
  // Card dos totais
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(120, yPos, 70, 40, 3, 3, 'F');
  
  yPos += 10;
  
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal: R$ ${proposal.subtotal.toFixed(2)}`, 125, yPos);
  
  if (proposal.discount > 0) {
    yPos += 8;
    doc.text(`Desconto: R$ ${proposal.discount.toFixed(2)}`, 125, yPos);
  }
  
  yPos += 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 31, 66);
  doc.text(`TOTAL: R$ ${proposal.total.toFixed(2)}`, 125, yPos);
  
  // PÁGINA FINAL - CONDIÇÕES E ASSINATURA
  doc.addPage();
  
  // Header da página
  doc.setFillColor(13, 31, 66);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TecSolutions', 20, 16);
  
  // Condições Gerais
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Condições Gerais', 20, 45);
  
  doc.setDrawColor(0, 230, 230);
  doc.setLineWidth(1);
  doc.line(20, 50, 190, 50);
  
  yPos = 65;
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const condicoes = [
    '• Proposta válida por 30 dias a partir da data de emissão',
    '• Pagamento: 50% na assinatura do contrato e 50% na entrega',
    '• Prazo de execução: conforme cronograma apresentado',
    '• Garantia: 12 meses para serviços e conforme fabricante para produtos',
    '• Valores não incluem impostos (ISS, PIS, COFINS)',
    '• Frete e deslocamento por conta do cliente quando aplicável'
  ];
  
  condicoes.forEach(item => {
    doc.text(item, 20, yPos);
    yPos += 8;
  });
  
  // Observações personalizadas
  if (proposal.notes) {
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 31, 66);
    doc.text('Observações:', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const notesLines = doc.splitTextToSize(proposal.notes, 170);
    doc.text(notesLines, 20, yPos);
    yPos += notesLines.length * 5;
  }
  
  // Seção de assinatura
  yPos = Math.max(yPos + 30, 200);
  
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Aprovação da Proposta:', 20, yPos);
  
  yPos += 20;
  doc.setDrawColor(51, 51, 51);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 90, yPos);
  doc.line(120, yPos, 190, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text('Cliente', 20, yPos);
  doc.text('TecSolutions', 120, yPos);
  
  yPos += 5;
  doc.text(`${proposal.client.name}`, 20, yPos);
  doc.text('Representante Comercial', 120, yPos);
  
  // Rodapé final
  doc.setFontSize(8);
  doc.setTextColor(108, 117, 125);
  doc.text('TecSolutions Informática LTDA - CNPJ: 09.385.049/0001-84', 105, 280, { align: 'center' });
  doc.text('Rua Campos Sales, 303, Sala 703-A, Centro, Barueri/SP - CEP 06401-000', 105, 285, { align: 'center' });
  doc.text('contato@tecsolutions.com.br | (11) 2306-3144 | © 2007 TecSolutions', 105, 290, { align: 'center' });
  
  // Salvar PDF
  const fileName = `Proposta_${proposal.number}_${proposal.client.company.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};