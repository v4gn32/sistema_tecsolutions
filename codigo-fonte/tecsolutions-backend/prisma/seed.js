// prisma/seed.js
// => Popula usuário admin e alguns registros iniciais
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // cria admin padrão
  const adminEmail = 'admin@tecsolutions.com';
  const adminPass = '@T231009s';

  const passwordHash = await bcrypt.hash(adminPass, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrador',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  // cliente exemplo
  const client = await prisma.client.create({
    data: {
      name: 'Allora Construtora',
      type: 'CONTRACT',
      email: 'sandra@alloraconstrutora.com',
      phone: '(11) 99999-9999',
      address: 'Rua Exemplo, 123 - SP'
    }
  });

  // produto e serviço base
  const product = await prisma.product.create({
    data: {
      name: 'Notebook Dell',
      description: 'Notebook corporativo',
      sku: 'NB-DEL-001',
      price: 3500.00
    }
  });

  const service = await prisma.service.create({
    data: {
      name: 'Suporte Remoto',
      description: 'Atendimento remoto por hora',
      unitPrice: 120.00
    }
  });

  console.log({ admin, client, product, service });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
