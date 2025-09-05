import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@tecsolutions.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário administrador criado:', admin.email);

  // Criar alguns serviços de exemplo
  await prisma.service.createMany({
    data: [
      {
        name: 'Configuração de Servidor',
        description: 'Instalação e configuração completa de servidor Windows/Linux',
        price: 800,
        category: 'INFRAESTRUTURA',
        unit: 'unidade',
      },
      {
        name: 'Suporte Técnico Premium',
        description: 'Suporte técnico 24/7 com atendimento prioritário',
        price: 150,
        category: 'HELPDESK',
        unit: 'mês',
      },
      {
        name: 'Backup em Nuvem',
        description: 'Solução de backup automatizado em nuvem com criptografia',
        price: 200,
        category: 'BACKUP',
        unit: 'TB/mês',
      },
      {
        name: 'Migração para AWS',
        description: 'Migração completa de infraestrutura para Amazon Web Services',
        price: 2500,
        category: 'NUVEM',
        unit: 'projeto',
      },
      {
        name: 'Cabeamento Estruturado',
        description: 'Instalação de rede estruturada com certificação',
        price: 80,
        category: 'CABEAMENTO',
        unit: 'ponto',
      },
    ],
  });

  console.log('✅ Serviços de exemplo criados');

  // Criar alguns produtos de exemplo
  await prisma.product.createMany({
    data: [
      {
        name: 'Cabo de Rede Cat6',
        description: 'Cabo de rede categoria 6 para redes Gigabit',
        price: 2.50,
        category: 'CABOS',
        unit: 'metro',
        brand: 'Furukawa',
        stock: 1000,
      },
      {
        name: 'Switch 24 Portas',
        description: 'Switch gerenciável 24 portas Gigabit',
        price: 850,
        category: 'EQUIPAMENTOS',
        unit: 'unidade',
        brand: 'TP-Link',
        model: 'TL-SG1024D',
        stock: 5,
      },
      {
        name: 'Conector RJ45',
        description: 'Conector RJ45 Cat6 blindado',
        price: 1.20,
        category: 'CONECTORES',
        unit: 'unidade',
        stock: 500,
      },
    ],
  });

  console.log('✅ Produtos de exemplo criados');

  // Criar cliente de exemplo
  const client = await prisma.client.create({
    data: {
      name: 'João Silva',
      email: 'joao@empresa.com',
      phone: '(11) 99999-9999',
      company: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      type: 'CONTRATO',
    },
  });

  console.log('✅ Cliente de exemplo criado:', client.name);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });