import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Criar proposta
export const createProposal = asyncHandler(async (req: Request, res: Response) => {
  const {
    clientId,
    title,
    description,
    validUntil,
    notes,
    items
  } = req.body;

  const userId = (req as any).user?.id;

  // Verificar se o cliente existe
  const client = await prisma.client.findUnique({
    where: { id: clientId }
  });

  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Validar itens da proposta
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError('A proposta deve conter pelo menos um item', 400);
  }

  // Validar cada item
  for (const item of items) {
    if (!item.type || !['SERVICE', 'PRODUCT'].includes(item.type)) {
      throw new AppError('Tipo de item inválido. Use SERVICE ou PRODUCT', 400);
    }

    if (!item.quantity || item.quantity <= 0) {
      throw new AppError('Quantidade deve ser maior que zero', 400);
    }

    if (!item.unitPrice || item.unitPrice <= 0) {
      throw new AppError('Preço unitário deve ser maior que zero', 400);
    }

    // Verificar se o serviço ou produto existe
    if (item.type === 'SERVICE' && item.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: item.serviceId }
      });
      if (!service) {
        throw new AppError(`Serviço com ID ${item.serviceId} não encontrado`, 404);
      }
    }

    if (item.type === 'PRODUCT' && item.productId) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        throw new AppError(`Produto com ID ${item.productId} não encontrado`, 404);
      }
    }
  }

  // Calcular totais
  let subtotal = 0;
  const processedItems = items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    
    return {
      type: item.type,
      serviceId: item.type === 'SERVICE' ? item.serviceId : null,
      productId: item.type === 'PRODUCT' ? item.productId : null,
      description: item.description || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: itemTotal
    };
  });

  const discountAmount = req.body.discountAmount || 0;
  const discountPercentage = req.body.discountPercentage || 0;
  
  let finalDiscount = 0;
  if (discountPercentage > 0) {
    finalDiscount = (subtotal * discountPercentage) / 100;
  } else if (discountAmount > 0) {
    finalDiscount = discountAmount;
  }

  const totalAmount = subtotal - finalDiscount;

  // Gerar número único da proposta
  const proposalCount = await prisma.proposal.count();
  const proposalNumber = `PROP-${String(proposalCount + 1).padStart(6, '0')}`;

  // Criar proposta com itens
  const proposal = await prisma.proposal.create({
    data: {
      clientId,
      number: proposalNumber,
      title,
      description,
      subtotal,
      discount: finalDiscount,
      total: totalAmount,
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias se não especificado
      notes,
      items: {
        create: processedItems.filter(item => item.type === 'SERVICE')
      },
      productItems: {
        create: processedItems.filter(item => item.type === 'PRODUCT').map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.totalPrice
        }))
      }
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          service: true
        }
      },
      productItems: {
        include: {
          product: true
        }
      }
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Proposta criada com sucesso',
    data: proposal
  };

  res.status(201).json(response);
});

// Listar propostas
export const getProposals = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    clientId, 
    status, 
    userId,
    startDate,
    endDate,
    minAmount,
    maxAmount
  } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { client: { name: { contains: search as string, mode: 'insensitive' } } }
    ];
  }
  
  if (clientId) {
    where.clientId = clientId;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) where.createdAt.lte = new Date(endDate as string);
  }

  if (minAmount || maxAmount) {
    where.total = {};
    if (minAmount) where.total.gte = parseFloat(minAmount as string);
    if (maxAmount) where.total.lte = parseFloat(maxAmount as string);
  }

  // Buscar propostas
  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            items: true,
            productItems: true
          }
        }
      }
    }),
    prisma.proposal.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Propostas listadas com sucesso',
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

// Buscar proposta por ID
export const getProposalById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      client: true,
      items: {
        include: {
          service: true
        },
        orderBy: { createdAt: 'asc' }
      },
      productItems: {
        include: {
          product: true
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!proposal) {
    throw new AppError('Proposta não encontrada', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Proposta encontrada',
    data: proposal
  };

  res.json(response);
});

// Atualizar proposta
export const updateProposal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    validUntil,
    notes,
    items,
    discountAmount,
    discountPercentage
  } = req.body;

  // Verificar se a proposta existe
  const existingProposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      items: true,
      productItems: true
    }
  });

  if (!existingProposal) {
    throw new AppError('Proposta não encontrada', 404);
  }

  // Verificar se a proposta pode ser editada
  if (existingProposal.status === 'ACCEPTED' || existingProposal.status === 'REJECTED') {
    throw new AppError('Não é possível editar proposta que já foi aceita ou rejeitada', 400);
  }

  let updateData: any = {};
  
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null;
  if (notes !== undefined) updateData.notes = notes;

  // Se está atualizando itens, recalcular totais
  if (items && Array.isArray(items)) {
    // Validar itens
    for (const item of items) {
      if (!item.type || !['SERVICE', 'PRODUCT'].includes(item.type)) {
        throw new AppError('Tipo de item inválido. Use SERVICE ou PRODUCT', 400);
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new AppError('Quantidade deve ser maior que zero', 400);
      }

      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new AppError('Preço unitário deve ser maior que zero', 400);
      }
    }

    // Calcular novos totais
    let subtotal = 0;
    const processedItems = items.map(item => {
      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;
      
      return {
        type: item.type,
        serviceId: item.type === 'SERVICE' ? item.serviceId : null,
        productId: item.type === 'PRODUCT' ? item.productId : null,
        description: item.description || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal
      };
    });

    let finalDiscount = 0;
    const finalDiscountPercentage = discountPercentage || 0;
    const finalDiscountAmount = discountAmount || existingProposal.discount;
    
    if (finalDiscountPercentage > 0) {
      finalDiscount = (subtotal * finalDiscountPercentage) / 100;
    } else if (finalDiscountAmount > 0) {
      finalDiscount = finalDiscountAmount;
    }

    const totalAmount = subtotal - finalDiscount;

    updateData.subtotal = subtotal;
    updateData.discount = finalDiscount;
    updateData.total = totalAmount;
  }

  // Atualizar proposta
  const proposal = await prisma.$transaction(async (tx) => {
    // Atualizar dados básicos da proposta
    const updatedProposal = await tx.proposal.update({
      where: { id },
      data: updateData
    });

    // Se está atualizando itens, deletar os antigos e criar os novos
    if (items && Array.isArray(items)) {
      await tx.proposalItem.deleteMany({
        where: { proposalId: id }
      });

      const processedItems = items.map(item => {
        const itemTotal = item.quantity * item.unitPrice;
        
        return {
          proposalId: id,
          type: item.type,
          serviceId: item.type === 'SERVICE' ? item.serviceId : null,
          productId: item.type === 'PRODUCT' ? item.productId : null,
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: itemTotal
        };
      });

      await tx.proposalItem.createMany({
        data: processedItems
      });
    }

    return updatedProposal;
  });

  // Buscar proposta atualizada com relacionamentos
  const updatedProposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          service: true
        }
      },
      productItems: {
        include: {
          product: true
        }
      }
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Proposta atualizada com sucesso',
    data: updatedProposal
  };

  res.json(response);
});

// Deletar proposta
export const deleteProposal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se a proposta existe
  const existingProposal = await prisma.proposal.findUnique({
    where: { id }
  });

  if (!existingProposal) {
    throw new AppError('Proposta não encontrada', 404);
  }

  // Verificar se a proposta pode ser deletada
  if (existingProposal.status === 'ACCEPTED') {
    throw new AppError('Não é possível deletar proposta que foi aceita', 400);
  }

  // Deletar proposta (itens serão deletados automaticamente por cascade)
  await prisma.proposal.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Proposta deletada com sucesso'
  };

  res.json(response);
});

// Atualizar status da proposta
export const updateProposalStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  // Verificar se a proposta existe
  const existingProposal = await prisma.proposal.findUnique({
    where: { id }
  });

  if (!existingProposal) {
    throw new AppError('Proposta não encontrada', 404);
  }

  // Validar status
  const validStatuses = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Status inválido', 400);
  }

  // Se está rejeitando, motivo é obrigatório
  if (status === 'REJECTED' && !rejectionReason) {
    throw new AppError('Motivo da rejeição é obrigatório', 400);
  }

  // Atualizar status
  const proposal = await prisma.proposal.update({
    where: { id },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  const response: ApiResponse = {
    success: true,
    message: `Status da proposta atualizado para ${status}`,
    data: proposal
  };

  res.json(response);
});

// Duplicar proposta
export const duplicateProposal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  // Buscar proposta original
  const originalProposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      items: true,
      productItems: true
    }
  });

  if (!originalProposal) {
    throw new AppError('Proposta não encontrada', 404);
  }

  // Gerar número único da nova proposta
  const proposalCount = await prisma.proposal.count();
  const proposalNumber = `PROP-${String(proposalCount + 1).padStart(6, '0')}`;

  // Criar nova proposta baseada na original
  const newProposal = await prisma.proposal.create({
    data: {
      clientId: originalProposal.clientId,
      number: proposalNumber,
      title: `${originalProposal.title} (Cópia)`,
      description: originalProposal.description,
      subtotal: originalProposal.subtotal,
      discount: originalProposal.discount,
      total: originalProposal.total,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      notes: originalProposal.notes,
      status: 'RASCUNHO',
      items: {
        create: originalProposal.items.map(item => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }))
      },
      productItems: {
        create: originalProposal.productItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }))
      }
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          service: true
        }
      },
      productItems: {
        include: {
          product: true
        }
      }
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Proposta duplicada com sucesso',
    data: newProposal
  };

  res.status(201).json(response);
});

// Estatísticas de propostas
export const getProposalStats = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, userId } = req.query;

  // Construir filtros
  const where: any = {};
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) where.createdAt.lte = new Date(endDate as string);
  }
  
  if (userId) {
    where.userId = userId;
  }

  // Buscar estatísticas
  const [totalProposals, proposalsByStatus, totalValue, avgValue] = await Promise.all([
    prisma.proposal.count({ where }),
    prisma.proposal.groupBy({
      by: ['status'],
      where,
      _count: {
        id: true
      },
      _sum: {
        total: true
      }
    }),
    prisma.proposal.aggregate({
      where,
      _sum: {
        total: true
      }
    }),
    prisma.proposal.aggregate({
      where,
      _avg: {
        total: true
      }
    })
  ]);

  const stats = {
    totalProposals,
    totalValue: totalValue._sum.total || 0,
    averageValue: avgValue._avg.total || 0,
    byStatus: proposalsByStatus.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count.id,
        value: item._sum.total || 0
      };
      return acc;
    }, {} as any)
  };

  const response: ApiResponse = {
    success: true,
    message: 'Estatísticas de propostas obtidas com sucesso',
    data: stats
  };

  res.json(response);
});