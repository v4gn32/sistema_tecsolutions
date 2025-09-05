import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import { LoginCredentials, ApiResponse, LoginResponse, CreateUserDto } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginCredentials = req.body;

  if (!email || !password) {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  // Buscar usuário pelo email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      createdAt: true,
      createdBy: true
    }
  });

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas', 401);
  }

  // Gerar token JWT
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Remover senha da resposta
  const { password: _, ...userWithoutPassword } = user;

  const response: ApiResponse<LoginResponse> = {
    success: true,
    data: {
      user: userWithoutPassword,
      token
    },
    message: 'Login realizado com sucesso'
  };

  res.json(response);
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Usuário não autenticado', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      createdBy: true
    }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: user,
    message: 'Usuário obtido com sucesso'
  };

  res.json(response);
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // No caso de JWT, o logout é feito no frontend removendo o token
  // Aqui podemos apenas retornar uma resposta de sucesso
  const response: ApiResponse = {
    success: true,
    message: 'Logout realizado com sucesso'
  };

  res.json(response);
});

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role = 'USER' }: CreateUserDto = req.body;

  if (!name || !email || !password) {
    throw new AppError('Nome, email e senha são obrigatórios', 400);
  }

  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('Usuário já existe com este email', 409);
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 12);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      createdBy: true
    }
  });

  // Gerar token JWT
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const response: ApiResponse<LoginResponse> = {
    success: true,
    data: {
      user,
      token
    },
    message: 'Usuário registrado com sucesso'
  };

  res.status(201).json(response);
});

export const validateToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Se chegou até aqui, o token é válido (passou pelo middleware de auth)
  const response: ApiResponse = {
    success: true,
    data: req.user,
    message: 'Token válido'
  };

  res.json(response);
});