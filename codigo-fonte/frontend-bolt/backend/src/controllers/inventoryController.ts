import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// ===== HARDWARE INVENTORY =====

// Criar item de hardware
export const createHardwareItem = asyncHandler(async (req: Request, res: Response) => {
  const {
    clientId,
    name,
    type,
    brand,
    model,
    serialNumber,
    specifications,
    purchaseDate,
    warrantyExpiry,
    location,
    status,
    notes
  } = req.body;

  // Verificar se o cliente existe
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      throw new AppError('Cliente não encontrado', 404);
    }
  }

  // Verificar se já existe item com o mesmo número de série
  if (serialNumber) {
    const existingItem = await prisma.hardwareInventory.findFirst({
      where: {
        serialNumber,
        clientId: clientId || null
      }
    });

    if (existingItem) {
      throw new AppError('Já existe um item com este número de série para este cliente', 400);
    }
  }

  const hardwareItem = await prisma.hardwareInventory.create({
    data: {
      clientId: clientId || null,
      name,
      type,
      brand,
      model,
      serialNumber,
      specifications,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
      location,
      status: status || 'ACTIVE',
      notes
    },
    include: {
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
    message: 'Item de hardware criado com sucesso',
    data: hardwareItem
  };

  res.status(201).json(response);
});

// Listar itens de hardware
export const getHardwareItems = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    clientId, 
    type, 
    brand, 
    status,
    location,
    warrantyExpiring
  } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { brand: { contains: search as string, mode: 'insensitive' } },
      { model: { contains: search as string, mode: 'insensitive' } },
      { serialNumber: { contains: search as string, mode: 'insensitive' } },
      { location: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (clientId) {
    where.clientId = clientId;
  }
  
  if (type) {
    where.type = { contains: type as string, mode: 'insensitive' };
  }
  
  if (brand) {
    where.brand = { contains: brand as string, mode: 'insensitive' };
  }
  
  if (status) {
    where.status = status;
  }
  
  if (location) {
    where.location = { contains: location as string, mode: 'insensitive' };
  }

  // Filtro para garantias expirando (próximos 30 dias)
  if (warrantyExpiring === 'true') {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    where.warrantyExpiry = {
      lte: thirtyDaysFromNow,
      gte: new Date()
    };
  }

  // Buscar itens
  const [items, total] = await Promise.all([
    prisma.hardwareInventory.findMany({
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
        }
      }
    }),
    prisma.hardwareInventory.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Itens de hardware listados com sucesso',
    data: {
      items,
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

// Buscar item de hardware por ID
export const getHardwareItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await prisma.hardwareInventory.findUnique({
    where: { id },
    include: {
      client: true
    }
  });

  if (!item) {
    throw new AppError('Item de hardware não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Item de hardware encontrado',
    data: item
  };

  res.json(response);
});

// Atualizar item de hardware
export const updateHardwareItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    clientId,
    name,
    type,
    brand,
    model,
    serialNumber,
    specifications,
    purchaseDate,
    warrantyExpiry,
    location,
    status,
    notes
  } = req.body;

  // Verificar se o item existe
  const existingItem = await prisma.hardwareInventory.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError('Item de hardware não encontrado', 404);
  }

  // Verificar se o cliente existe (se fornecido)
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      throw new AppError('Cliente não encontrado', 404);
    }
  }

  // Verificar duplicação de número de série
  if (serialNumber && serialNumber !== existingItem.serialNumber) {
    const duplicateItem = await prisma.hardwareInventory.findFirst({
      where: {
        serialNumber,
        clientId: clientId || existingItem.clientId,
        id: { not: id }
      }
    });

    if (duplicateItem) {
      throw new AppError('Já existe um item com este número de série para este cliente', 400);
    }
  }

  const updatedItem = await prisma.hardwareInventory.update({
    where: { id },
    data: {
      clientId: clientId !== undefined ? clientId : undefined,
      name,
      type,
      brand,
      model,
      serialNumber,
      specifications,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : purchaseDate === null ? null : undefined,
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : warrantyExpiry === null ? null : undefined,
      location,
      status,
      notes
    },
    include: {
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
    message: 'Item de hardware atualizado com sucesso',
    data: updatedItem
  };

  res.json(response);
});

// Deletar item de hardware
export const deleteHardwareItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o item existe
  const existingItem = await prisma.hardwareInventory.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError('Item de hardware não encontrado', 404);
  }

  await prisma.hardwareInventory.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Item de hardware deletado com sucesso'
  };

  res.json(response);
});

// ===== SOFTWARE INVENTORY =====

// Criar item de software
export const createSoftwareItem = asyncHandler(async (req: Request, res: Response) => {
  const {
    clientId,
    name,
    version,
    vendor,
    licenseType,
    licenseKey,
    maxInstallations,
    currentInstallations,
    purchaseDate,
    expiryDate,
    status,
    notes
  } = req.body;

  // Verificar se o cliente existe
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      throw new AppError('Cliente não encontrado', 404);
    }
  }

  // Verificar se já existe software com a mesma chave de licença
  if (licenseKey) {
    const existingItem = await prisma.softwareInventory.findFirst({
      where: {
        licenseKey,
        clientId: clientId || null
      }
    });

    if (existingItem) {
      throw new AppError('Já existe um software com esta chave de licença para este cliente', 400);
    }
  }

  const softwareItem = await prisma.softwareInventory.create({
    data: {
      clientId: clientId || null,
      name,
      version,
      vendor,
      licenseType,
      licenseKey,
      maxInstallations: maxInstallations || 1,
      currentInstallations: currentInstallations || 0,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      status: status || 'ACTIVE',
      notes
    },
    include: {
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
    message: 'Item de software criado com sucesso',
    data: softwareItem
  };

  res.status(201).json(response);
});

// Listar itens de software
export const getSoftwareItems = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    clientId, 
    vendor, 
    licenseType, 
    status,
    expiring,
    overInstalled
  } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { version: { contains: search as string, mode: 'insensitive' } },
      { vendor: { contains: search as string, mode: 'insensitive' } },
      { licenseKey: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (clientId) {
    where.clientId = clientId;
  }
  
  if (vendor) {
    where.vendor = { contains: vendor as string, mode: 'insensitive' };
  }
  
  if (licenseType) {
    where.licenseType = licenseType;
  }
  
  if (status) {
    where.status = status;
  }

  // Filtro para licenças expirando (próximos 30 dias)
  if (expiring === 'true') {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    where.expiryDate = {
      lte: thirtyDaysFromNow,
      gte: new Date()
    };
  }

  // Filtro para softwares com instalações acima do limite
  if (overInstalled === 'true') {
    where.currentInstallations = {
      gt: prisma.softwareInventory.fields.maxInstallations
    };
  }

  // Buscar itens
  const [items, total] = await Promise.all([
    prisma.softwareInventory.findMany({
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
        }
      }
    }),
    prisma.softwareInventory.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Itens de software listados com sucesso',
    data: {
      items,
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

// Buscar item de software por ID
export const getSoftwareItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await prisma.softwareInventory.findUnique({
    where: { id },
    include: {
      client: true
    }
  });

  if (!item) {
    throw new AppError('Item de software não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Item de software encontrado',
    data: item
  };

  res.json(response);
});

// Atualizar item de software
export const updateSoftwareItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    clientId,
    name,
    version,
    vendor,
    licenseType,
    licenseKey,
    maxInstallations,
    currentInstallations,
    purchaseDate,
    expiryDate,
    status,
    notes
  } = req.body;

  // Verificar se o item existe
  const existingItem = await prisma.softwareInventory.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError('Item de software não encontrado', 404);
  }

  // Verificar se o cliente existe (se fornecido)
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      throw new AppError('Cliente não encontrado', 404);
    }
  }

  // Verificar duplicação de chave de licença
  if (licenseKey && licenseKey !== existingItem.licenseKey) {
    const duplicateItem = await prisma.softwareInventory.findFirst({
      where: {
        licenseKey,
        clientId: clientId || existingItem.clientId,
        id: { not: id }
      }
    });

    if (duplicateItem) {
      throw new AppError('Já existe um software com esta chave de licença para este cliente', 400);
    }
  }

  const updatedItem = await prisma.softwareInventory.update({
    where: { id },
    data: {
      clientId: clientId !== undefined ? clientId : undefined,
      name,
      version,
      vendor,
      licenseType,
      licenseKey,
      maxInstallations,
      currentInstallations,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : purchaseDate === null ? null : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : expiryDate === null ? null : undefined,
      status,
      notes
    },
    include: {
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
    message: 'Item de software atualizado com sucesso',
    data: updatedItem
  };

  res.json(response);
});

// Deletar item de software
export const deleteSoftwareItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o item existe
  const existingItem = await prisma.softwareInventory.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError('Item de software não encontrado', 404);
  }

  await prisma.softwareInventory.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Item de software deletado com sucesso'
  };

  res.json(response);
});

// Atualizar instalações de software
export const updateSoftwareInstallations = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentInstallations } = req.body;

  // Verificar se o item existe
  const existingItem = await prisma.softwareInventory.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError('Item de software não encontrado', 404);
  }

  if (currentInstallations < 0) {
    throw new AppError('Número de instalações não pode ser negativo', 400);
  }

  const updatedItem = await prisma.softwareInventory.update({
    where: { id },
    data: {
      currentInstallations
    },
    include: {
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
    message: 'Instalações de software atualizadas com sucesso',
    data: updatedItem
  };

  res.json(response);
});

// ===== ESTATÍSTICAS E RELATÓRIOS =====

// Estatísticas de inventário
export const getInventoryStats = asyncHandler(async (req: Request, res: Response) => {
  const { clientId } = req.query;

  // Construir filtros
  const where: any = {};
  if (clientId) {
    where.clientId = clientId;
  }

  // Estatísticas de hardware
  const [hardwareTotal, hardwareByBrand] = await Promise.all([
    prisma.hardwareInventory.count({ where }),
    prisma.hardwareInventory.groupBy({
      by: ['brand'],
      where,
      _count: {
        id: true
      }
    })
  ]);

  // Estatísticas de software
  const [softwareTotal, softwareBySoftwareType, softwareByUserControl] = await Promise.all([
    prisma.softwareInventory.count({ where }),
    prisma.softwareInventory.groupBy({
      by: ['softwareType'],
      where,
      _count: {
        id: true
      }
    }),
    prisma.softwareInventory.groupBy({
      by: ['userControl'],
      where,
      _count: {
        id: true
      }
    })
  ]);

  // Software com alerta de expiração (próximos 30 dias)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const expiringSoftware = await prisma.softwareInventory.count({
    where: {
      ...where,
      expirationAlert: {
        lte: thirtyDaysFromNow,
        gte: new Date()
      }
    }
  });

  const stats = {
    hardware: {
      total: hardwareTotal,
      byBrand: hardwareByBrand.reduce((acc, item) => {
        acc[item.brand] = item._count.id;
        return acc;
      }, {} as any)
    },
    software: {
      total: softwareTotal,
      bySoftwareType: softwareBySoftwareType.reduce((acc, item) => {
        acc[item.softwareType] = item._count.id;
        return acc;
      }, {} as any),
      byUserControl: softwareByUserControl.reduce((acc, item) => {
        acc[item.userControl] = item._count.id;
        return acc;
      }, {} as any),
      expiringSoftware
    }
  };

  const response: ApiResponse = {
    success: true,
    message: 'Estatísticas de inventário obtidas com sucesso',
    data: stats
  };

  res.json(response);
});