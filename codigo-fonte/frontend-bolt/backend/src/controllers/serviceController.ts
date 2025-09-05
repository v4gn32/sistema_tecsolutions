import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Criar serviço
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    category,
    price,
    estimatedHours,
    isActive
  } = req.body;

  // Verificar se já existe serviço com o mesmo nome
  const existingService = await prisma.service.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  });

  if (existingService) {
    throw new AppError('Já existe um serviço com este nome', 400);
  }

  // Criar serviço
  const service = await prisma.service.create({
    data: {
      name,
      description,
      category,
      price: parseFloat(price),
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      isActive: isActive !== undefined ? isActive : true
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Serviço criado com sucesso',
    data: service
  };

  res.status(201).json(response);
});

// Listar serviços
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, category, isActive, minPrice, maxPrice } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { category: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (category) {
    where.category = { contains: category as string, mode: 'insensitive' };
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice as string);
    if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
  }

  // Buscar serviços
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            proposalItems: true
          }
        }
      }
    }),
    prisma.service.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Serviços listados com sucesso',
    data: {
      services,
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

// Buscar serviço por ID
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      proposalItems: {
        include: {
          proposal: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          proposalItems: true
        }
      }
    }
  });

  if (!service) {
    throw new AppError('Serviço não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Serviço encontrado',
    data: service
  };

  res.json(response);
});

// Atualizar serviço
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    price,
    estimatedHours,
    isActive
  } = req.body;

  // Verificar se o serviço existe
  const existingService = await prisma.service.findUnique({
    where: { id }
  });

  if (!existingService) {
    throw new AppError('Serviço não encontrado', 404);
  }

  // Se está atualizando nome, verificar se não existe outro serviço com o mesmo nome
  if (name && name !== existingService.name) {
    const nameExists = await prisma.service.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        id: {
          not: id
        }
      }
    });

    if (nameExists) {
      throw new AppError('Já existe um serviço com este nome', 400);
    }
  }

  // Preparar dados para atualização
  const updateData: any = {};
  
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : null;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Atualizar serviço
  const service = await prisma.service.update({
    where: { id },
    data: updateData
  });

  const response: ApiResponse = {
    success: true,
    message: 'Serviço atualizado com sucesso',
    data: service
  };

  res.json(response);
});

// Deletar serviço
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o serviço existe
  const existingService = await prisma.service.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          proposalItems: true
        }
      }
    }
  });

  if (!existingService) {
    throw new AppError('Serviço não encontrado', 404);
  }

  // Verificar se o serviço está sendo usado em propostas
  if (existingService._count.proposalItems > 0) {
    throw new AppError('Não é possível deletar serviço que está sendo usado em propostas. Desative o serviço em vez de deletá-lo.', 400);
  }

  // Deletar serviço
  await prisma.service.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Serviço deletado com sucesso'
  };

  res.json(response);
});

// Ativar/Desativar serviço
export const toggleServiceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o serviço existe
  const existingService = await prisma.service.findUnique({
    where: { id }
  });

  if (!existingService) {
    throw new AppError('Serviço não encontrado', 404);
  }

  // Alternar status
  const service = await prisma.service.update({
    where: { id },
    data: { isActive: !existingService.isActive }
  });

  const response: ApiResponse = {
    success: true,
    message: `Serviço ${service.isActive ? 'ativado' : 'desativado'} com sucesso`,
    data: service
  };

  res.json(response);
});

// Listar categorias de serviços
export const getServiceCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.service.findMany({
    select: {
      category: true
    },
    where: {
      category: {
        not: null
      }
    },
    distinct: ['category']
  });

  const uniqueCategories = categories
    .map(item => item.category)
    .filter(category => category !== null)
    .sort();

  const response: ApiResponse = {
    success: true,
    message: 'Categorias de serviços listadas com sucesso',
    data: uniqueCategories
  };

  res.json(response);
});