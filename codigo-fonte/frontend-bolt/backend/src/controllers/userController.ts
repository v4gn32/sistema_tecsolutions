import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Criar usuário
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('Usuário já existe com este email', 400);
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 12);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Usuário criado com sucesso',
    data: user
  };

  res.status(201).json(response);
});

// Listar usuários
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, role, isActive } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (role) {
    where.role = role;
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  // Buscar usuários
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Usuários listados com sucesso',
    data: {
      users,
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

// Buscar usuário por ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Usuário encontrado',
    data: user
  };

  res.json(response);
});

// Atualizar usuário
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, isActive, password } = req.body;

  // Verificar se o usuário existe
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new AppError('Usuário não encontrado', 404);
  }

  // Se está atualizando email, verificar se não existe outro usuário com o mesmo email
  if (email && email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email }
    });

    if (emailExists) {
      throw new AppError('Já existe um usuário com este email', 400);
    }
  }

  // Preparar dados para atualização
  const updateData: any = {};
  
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  
  // Se está atualizando senha
  if (password) {
    updateData.password = await bcrypt.hash(password, 12);
  }

  // Atualizar usuário
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Usuário atualizado com sucesso',
    data: user
  };

  res.json(response);
});

// Deletar usuário
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o usuário existe
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new AppError('Usuário não encontrado', 404);
  }

  // Verificar se não é o próprio usuário logado
  const currentUserId = (req as any).user?.id;
  if (id === currentUserId) {
    throw new AppError('Você não pode deletar sua própria conta', 400);
  }

  // Deletar usuário
  await prisma.user.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Usuário deletado com sucesso'
  };

  res.json(response);
});

// Ativar/Desativar usuário
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o usuário existe
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new AppError('Usuário não encontrado', 404);
  }

  // Verificar se não é o próprio usuário logado
  const currentUserId = (req as any).user?.id;
  if (id === currentUserId) {
    throw new AppError('Você não pode alterar o status da sua própria conta', 400);
  }

  // Alternar status
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: !existingUser.isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const response: ApiResponse = {
    success: true,
    message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso`,
    data: user
  };

  res.json(response);
});