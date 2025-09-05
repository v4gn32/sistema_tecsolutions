import jsPDF from 'jspdf';
import { Client, ServiceRecord } from '../types';

export interface ClientServiceReport {
  client: Client;
  records: ServiceRecord[];
  period: {
    start: Date;
    end: Date;
  };
}

export const generateClientServiceReportPDF = (report: ClientServiceReport): void => {
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
      addHeader();
      return 40;
    }
    return currentY;
  };
  
  // Função para adicionar cabeçalho
  const addHeader = () => {
    // Fundo do cabeçalho
    doc.setFillColor(13, 31, 66);
    doc.rect(0, 0, 210, 25, 'F');
    
    // Logo/Nome da empresa
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TecSolutions', 20, 16);
    
    // Subtítulo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Soluções em Tecnologia da Informação', 120, 16);
  };
  
  // Função para adicionar rodapé
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    doc.text('TecSolutions Informática LTDA - CNPJ: 09.385.049/0001-84', 105, 280, { align: 'center' });
    doc.text('Rua Campos Sales, 303, Sala 703-A, Centro, Barueri/SP - CEP 06401-000', 105, 285, { align: 'center' });
    doc.text('contato@tecsolutions.com.br | (11) 2306-3144 | © 2007 TecSolutions', 105, 290, { align: 'center' });
  };
  
  // Função para obter configuração do tipo de serviço
  const getServiceTypeConfig = (type: string) => {
    const configs = {
      remote: { label: 'Atendimento Remoto', color: '#3B82F6' },
      onsite: { label: 'Atendimento Presencial', color: '#10B981' },
      laboratory: { label: 'Serviços de Laboratório', color: '#8B5CF6' },
      third_party: { label: 'Serviços de Terceiros', color: '#F59E0B' }
    };
    return configs[type as keyof typeof configs] || { label: 'Outros', color: '#6B7280' };
  };
  
  // PÁGINA 1 - CAPA
  addHeader();
  
  // Título do relatório
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE ATENDIMENTOS', 105, 60, { align: 'center' });
  
  // Linha decorativa
  doc.setDrawColor(0, 230, 230);
  doc.setLineWidth(2);
  doc.line(60, 70, 150, 70);
  
  // Informações do cliente
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE:', 105, 90, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(report.client.company, 105, 105, { align: 'center' });
  doc.text(report.client.name, 105, 115, { align: 'center' });
  
  // Período do relatório
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PERÍODO:', 105, 140, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  const periodText = `${report.period.start.toLocaleDateString('pt-BR')} a ${report.period.end.toLocaleDateString('pt-BR')}`;
  doc.text(periodText, 105, 150, { align: 'center' });
  
  // Resumo estatístico
  const totalAtendimentos = report.records.length;
  const atendimentosRemoto = report.records.filter(r => r.type === 'remote').length;
  const atendimentosPresencial = report.records.filter(r => r.type === 'onsite').length;
  const atendimentosLaboratorio = report.records.filter(r => r.type === 'laboratory').length;
  const atendimentosTerceiros = report.records.filter(r => r.type === 'third_party').length;
  
  const totalHoras = report.records
    .filter(r => r.type === 'onsite' && r.totalHours)
    .reduce((sum, r) => sum + (r.totalHours || 0), 0);
  
  // Card de resumo
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(30, 170, 150, 80, 5, 5, 'F');
  
  doc.setTextColor(13, 31, 66);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO DO PERÍODO', 105, 185, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  
  let yPos = 200;
  doc.text(`Total de Atendimentos: ${totalAtendimentos}`, 40, yPos);
  yPos += 8;
  doc.text(`Atendimentos Remotos: ${atendimentosRemoto}`, 40, yPos);
  yPos += 8;
  doc.text(`Atendimentos Presenciais: ${atendimentosPresencial}`, 40, yPos);
  yPos += 8;
  doc.text(`Serviços de Laboratório: ${atendimentosLaboratorio}`, 40, yPos);
  yPos += 8;
  doc.text(`Serviços de Terceiros: ${atendimentosTerceiros}`, 40, yPos);
  
  if (totalHoras > 0) {
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de Horas Presenciais: ${totalHoras.toFixed(1)}h`, 40, yPos);
  }
  
  addFooter();
  
  // PÁGINAS SEGUINTES - DETALHAMENTO DOS ATENDIMENTOS
  if (report.records.length > 0) {
    doc.addPage();
    addHeader();
    
    // Título da seção
    doc.setTextColor(13, 31, 66);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALHAMENTO DOS ATENDIMENTOS', 20, 40);
    
    // Linha decorativa
    doc.setDrawColor(0, 230, 230);
    doc.setLineWidth(1);
    doc.line(20, 45, 190, 45);
    
    yPos = 55;
    
    // Agrupar atendimentos por data
    const recordsByDate = report.records.reduce((acc, record) => {
      const dateKey = new Date(record.date).toLocaleDateString('pt-BR');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      return acc;
    }, {} as Record<string, ServiceRecord[]>);
    
    // Ordenar datas
    const sortedDates = Object.keys(recordsByDate).sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
    
    sortedDates.forEach(date => {
      const dayRecords = recordsByDate[date];
      
      yPos = checkPageBreak(yPos, 30);
      
      // Cabeçalho do dia
      doc.setFillColor(13, 31, 66);
      doc.rect(20, yPos - 5, 170, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`📅 ${date}`, 25, yPos + 2);
      
      yPos += 15;
      
      dayRecords.forEach(record => {
        yPos = checkPageBreak(yPos, 40);
        
        const typeConfig = getServiceTypeConfig(record.type);
        
        // Card do atendimento
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(25, yPos - 3, 160, 35, 3, 3, 'F');
        
        // Tipo de atendimento
        doc.setTextColor(13, 31, 66);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`🔧 ${typeConfig.label}`, 30, yPos + 5);
        
        // Descrição
        doc.setTextColor(51, 51, 51);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const descLines = doc.splitTextToSize(record.description, 150);
        doc.text(descLines.slice(0, 2), 30, yPos + 12); // Máximo 2 linhas
        
        // Informações específicas por tipo
        let infoText = '';
        if (record.type === 'onsite' && record.totalHours) {
          infoText = `⏰ ${record.arrivalTime} às ${record.departureTime} (${record.totalHours.toFixed(1)}h)`;
        } else if (record.type === 'laboratory') {
          if (record.deviceReceived && record.deviceReturned) {
            infoText = `📦 Recebido: ${new Date(record.deviceReceived).toLocaleDateString('pt-BR')} | Devolvido: ${new Date(record.deviceReturned).toLocaleDateString('pt-BR')}`;
          }
        } else if (record.type === 'third_party' && record.thirdPartyCompany) {
          infoText = `🏢 ${record.thirdPartyCompany}`;
          if (record.cost && record.cost > 0) {
            infoText += ` - R$ ${record.cost.toFixed(2)}`;
          }
        }
        
        if (infoText) {
          doc.setFontSize(8);
          doc.setTextColor(108, 117, 125);
          doc.text(infoText, 30, yPos + 22);
        }
        
        // Serviços executados
        if (record.services && record.services.length > 0) {
          doc.setFontSize(8);
          doc.setTextColor(0, 230, 230);
          doc.text('Serviços: ' + record.services.slice(0, 3).join(', '), 30, yPos + 28);
          if (record.services.length > 3) {
            doc.text(`... e mais ${record.services.length - 3} serviços`, 30, yPos + 32);
          }
        }
        
        yPos += 40;
      });
      
      yPos += 5; // Espaço entre dias
    });
    
    addFooter();
  }
  
  // Salvar PDF
  const fileName = `Relatorio_Atendimentos_${report.client.company.replace(/[^a-zA-Z0-9]/g, '_')}_${report.period.start.toLocaleDateString('pt-BR').replace(/\//g, '-')}_${report.period.end.toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};