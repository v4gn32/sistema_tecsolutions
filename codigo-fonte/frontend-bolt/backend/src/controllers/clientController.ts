import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Criar cliente
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    document,
    documentType,
    address,
    city,
    state,
    zipCode,
    contactPerson,
    notes
  } = req.body;

  // Verificar se já existe cliente com o mesmo documento
  if (document) {
    const existingClient = await prisma.client.findUnique({
      where: { document }
    });

    if (existingClient) {
      throw new AppError('Já existe um cliente com este documento', 400);
    }
  }

  // Verificar se já existe cliente com o mesmo email
  if (email) {
    const existingEmail = await prisma.client.findUnique({
      where: { email }
    });

    if (existingEmail) {
      throw new AppError('Já existe um cliente com este email', 400);
    }
  }

  // Criar cliente
  const client = await prisma.client.create({
    data: {
      name,
      email,
      phone,
      document,
      documentType: documentType || 'CPF',
      address,
      city,
      state,
      zipCode,
      contactPerson,
      notes
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Cliente criado com sucesso',
    data: client
  };

  res.status(201).json(response);
});

// Listar clientes
export const getClients = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, city, state, isActive } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { document: { contains: search as string, mode: 'insensitive' } },
      { contactPerson: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (city) {
    where.city = { contains: city as string, mode: 'insensitive' };
  }
  
  if (state) {
    where.state = { contains: state as string, mode: 'insensitive' };
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  // Buscar clientes
  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            proposals: true,
            serviceRecords: true
          }
        }
      }
    }),
    prisma.client.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Clientes listados com sucesso',
    data: {
      clients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
});

// Buscar cliente por ID
export const getClientById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      proposals: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      serviceRecords: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      _count: {
        select: {
          proposals: true,
          serviceRecords: true
        }
      }
    }
  });

  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Cliente encontrado',
    data: client
  };

  res.json(response);
});

// Atualizar cliente
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    document,
    documentType,
    address,
    city,
    state,
    zipCode,
    contactPerson,
    notes,
    isActive
  } = req.body;

  // Verificar se o cliente existe
  const existingClient = await prisma.client.findUnique({
    where: { id }
  });

  if (!existingClient) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Se está atualizando documento, verificar se não existe outro cliente com o mesmo documento
  if (document && document !== existingClient.document) {
    const documentExists = await prisma.client.findUnique({
      where: { document }
    });

    if (documentExists) {
      throw new AppError('Já existe um cliente com este documento', 400);
    }
  }

  // Se está atualizando email, verificar se não existe outro cliente com o mesmo email
  if (email && email !== existingClient.email) {
    const emailExists = await prisma.client.findUnique({
      where: { email }
    });

    if (emailExists) {
      throw new AppError('Já existe um cliente com este email', 400);
    }
  }

  // Preparar dados para atualização
  const updateData: any = {};
  
  if (name) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (document !== undefined) updateData.document = document;
  if (documentType) updateData.documentType = documentType;
  if (address !== undefined) updateData.address = address;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;
  if (zipCode !== undefined) updateData.zipCode = zipCode;
  if (contactPerson !== undefined) updateData.contactPerson = contactPerson;
  if (notes !== undefined) updateData.notes = notes;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Atualizar cliente
  const client = await prisma.client.update({
    where: { id },
    data: updateData
  });

  const response: ApiResponse = {
    success: true,
    message: 'Cliente atualizado com sucesso',
    data: client
  };

  res.json(response);
});

// Deletar cliente
export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o cliente existe
  const existingClient = await prisma.client.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          proposals: true,
          serviceRecords: true
        }
      }
    }
  });

  if (!existingClient) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Verificar se o cliente tem propostas ou registros de serviço
  if (existingClient._count.proposals > 0 || existingClient._count.serviceRecords > 0) {
    throw new AppError('Não é possível deletar cliente que possui propostas ou registros de serviço. Desative o cliente em vez de deletá-lo.', 400);
  }

  // Deletar cliente
  await prisma.client.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Cliente deletado com sucesso'
  };

  res.json(response);
});

// Ativar/Desativar cliente
export const toggleClientStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o cliente existe
  const existingClient = await prisma.client.findUnique({
    where: { id }
  });

  if (!existingClient) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Alternar status
  const client = await prisma.client.update({
    where: { id },
    data: { isActive: !existingClient.isActive }
  });

  const response: ApiResponse = {
    success: true,
    message: `Cliente ${client.isActive ? 'ativado' : 'desativado'} com sucesso`,
    data: client
  };

  res.json(response);
});

// Buscar histórico de propostas do cliente
export const getClientProposals = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Verificar se o cliente existe
  const client = await prisma.client.findUnique({
    where: { id }
  });

  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Construir filtros
  const where: any = { clientId: id };
  
  if (status) {
    where.status = status;
  }

  // Buscar propostas
  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            service: true,
            product: true
          }
        }
      }
    }),
    prisma.proposal.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Propostas do cliente listadas com sucesso',
    data: {
      proposals,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
});

// Buscar histórico de atendimentos do cliente
export const getClientServiceRecords = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Verificar se o cliente existe
  const client = await prisma.client.findUnique({
    where: { id }
  });

  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Construir filtros
  const where: any = { clientId: id };
  
  if (status) {
    where.status = status;
  }

  // Buscar registros de atendimento
  const [serviceRecords, total] = await Promise.all([
    prisma.serviceRecord.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        technician: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }),
    prisma.serviceRecord.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Registros de atendimento do cliente listados com sucesso',
    data: {
      serviceRecords,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
});