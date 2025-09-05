const express = require('express');
type Request = express.Request;
type Response = express.Response; 
type NextFunction = express.NextFunction;
const { ApiResponse } = require('../types/index');

class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';

  // Se é um erro operacional conhecido
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Erros do Prisma
  else if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Registro já existe. Verifique os dados únicos.';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Registro não encontrado.';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Violação de chave estrangeira.';
        break;
      default:
        statusCode = 400;
        message = 'Erro de banco de dados.';
    }
  }
  // Erros de validação
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }
  // Erros de JWT
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Log do erro para desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  const response: ApiResponse = {
    success: false,
    error: message
  };

  res.status(statusCode).json(response);
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para rotas não encontradas
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Rota ${req.originalUrl} não encontrada`, 404);
  next(error);
};