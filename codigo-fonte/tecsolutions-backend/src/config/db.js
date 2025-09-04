// src/config/db.js
// Responsável por exportar uma única instância do Prisma (DB)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
