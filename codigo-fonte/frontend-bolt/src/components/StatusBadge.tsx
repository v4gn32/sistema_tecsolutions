import React from 'react';

interface StatusBadgeProps {
  status: 'rascunho' | 'enviada' | 'aprovada' | 'recusada';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'rascunho':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: 'Rascunho'
        };
      case 'enviada':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          label: 'Enviada'
        };
      case 'aprovada':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'Aprovada'
        };
      case 'recusada':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          label: 'Recusada'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: 'Desconhecido'
        };
    }
  };
  
  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;