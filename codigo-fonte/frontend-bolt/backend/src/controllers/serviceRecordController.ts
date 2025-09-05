import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Criar registro de atendimento
export const createServiceRecord = asyncHandler(async (req: Request, res: Response) => {
  const {
    clientId,
    type,
    date,
    description,
    services,
    arrivalTime,
    departureTime,
    lunchBreak,
    totalHours,
    deviceReceived,
    deviceReturned,
    labServices,
    thirdPartyCompany,
    sentDate,
    returnedDate,
    cost
  } = req.body;

  const createdBy = (req as any).user?.id;

  // Verificar se o cliente existe
  const client = await prisma.client.findUnique({
    where: { id: clientId }
  });

  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }

  // Validar campos obrigatórios
  if (!type || !date || !description) {
    throw new AppError('Tipo, data e descrição são obrigatórios', 400);
  }

  const serviceRecord = await prisma.serviceRecord.create({
    data: {
      clientId,
      createdBy,
      type,
      date: new Date(date),
      description,
      services: services || [],
      arrivalTime,
      departureTime,
      lunchBreak,
      totalHours,
      deviceReceived: deviceReceived ? new Date(deviceReceived) : null,
      deviceReturned: deviceReturned ? new Date(deviceReturned) : null,
      labServices: labServices || [],
      thirdPartyCompany,
      sentDate: sentDate ? new Date(sentDate) : null,
      returnedDate: returnedDate ? new Date(returnedDate) : null,
      cost
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      createdByUser: {
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
    message: 'Registro de atendimento criado com sucesso',
    data: serviceRecord
  };

  res.status(201).json(response);
});

// Listar registros de atendimento
export const getServiceRecords = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    clientId, 
    createdBy,
    type,
    startDate,
    endDate
  } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { description: { contains: search as string, mode: 'insensitive' } },
      { client: { name: { contains: search as string, mode: 'insensitive' } } }
    ];
  }
  
  if (clientId) {
    where.clientId = clientId;
  }
  
  if (createdBy) {
    where.createdBy = createdBy;
  }
  
  if (type) {
    where.type = type;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  // Buscar registros
  const [records, total] = await Promise.all([
    prisma.serviceRecord.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        createdByUser: {
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
    message: 'Registros de atendimento listados com sucesso',
    data: {
      records,
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

// Estatísticas de registros de atendimento
export const getServiceRecordStats = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, clientId } = req.query;

  // Construir filtros
  const where: any = {};
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }
  
  if (clientId) {
    where.clientId = clientId;
  }

  // Buscar estatísticas
  const [totalRecords, recordsByType] = await Promise.all([
    prisma.serviceRecord.count({ where }),
    prisma.serviceRecord.groupBy({
      by: ['type'],
      where,
      _count: {
        id: true
      }
    })
  ]);

  const stats = {
    totalRecords,
    byType: recordsByType.reduce((acc, item) => {
      acc[item.type] = item._count.id;
      return acc;
    }, {} as any)
  };

  const response: ApiResponse = {
    success: true,
    message: 'Estatísticas de registros de atendimento obtidas com sucesso',
    data: stats
  };

  res.json(response);
});

// Buscar registro de atendimento por ID
export const getServiceRecordById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const record = await prisma.serviceRecord.findUnique({
    where: { id },
    include: {
      client: true,
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!record) {
    throw new AppError('Registro de atendimento não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Registro de atendimento encontrado',
    data: record
  };

  res.json(response);
});

// Atualizar registro de atendimento
export const updateServiceRecord = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    type,
    date,
    description,
    services,
    arrivalTime,
    departureTime,
    lunchBreak,
    totalHours,
    deviceReceived,
    deviceReturned,
    labServices,
    thirdPartyCompany,
    sentDate,
    returnedDate,
    cost
  } = req.body;

  // Verificar se o registro existe
  const existingRecord = await prisma.serviceRecord.findUnique({
    where: { id }
  });

  if (!existingRecord) {
    throw new AppError('Registro de atendimento não encontrado', 404);
  }

  const updatedRecord = await prisma.serviceRecord.update({
    where: { id },
    data: {
      type,
      date: date ? new Date(date) : undefined,
      description,
      services,
      arrivalTime,
      departureTime,
      lunchBreak,
      totalHours,
      deviceReceived: deviceReceived ? new Date(deviceReceived) : deviceReceived === null ? null : undefined,
      deviceReturned: deviceReturned ? new Date(deviceReturned) : deviceReturned === null ? null : undefined,
      labServices,
      thirdPartyCompany,
      sentDate: sentDate ? new Date(sentDate) : sentDate === null ? null : undefined,
      returnedDate: returnedDate ? new Date(returnedDate) : returnedDate === null ? null : undefined,
      cost
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      createdByUser: {
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
    message: 'Registro de atendimento atualizado com sucesso',
    data: updatedRecord
  };

  res.json(response);
});

// Deletar registro de atendimento
export const deleteServiceRecord = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o registro existe
  const existingRecord = await prisma.serviceRecord.findUnique({
    where: { id }
  });

  if (!existingRecord) {
    throw new AppError('Registro de atendimento não encontrado', 404);
  }

  await prisma.serviceRecord.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Registro de atendimento deletado com sucesso'
  };

  res.json(response);
});