// src/controllers/services.controller.js
// => CRUD de serviços
import prisma from '../config/db.js';

export async function listServices(req, res) {
  try {
    const { q } = req.query;
    const services = await prisma.service.findMany({
      where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(services);
  } catch {
    return res.status(500).json({ message: 'Erro ao listar serviços' });
  }
}

export async function createService(req, res) {
  try {
    const { name, description, unitPrice } = req.body;
    const s = await prisma.service.create({ data: { name, description, unitPrice } });
    return res.status(201).json(s);
  } catch {
    return res.status(400).json({ message: 'Erro ao criar serviço' });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const s = await prisma.service.update({ where: { id }, data: req.body });
    return res.json(s);
  } catch {
    return res.status(400).json({ message: 'Erro ao atualizar serviço' });
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(400).json({ message: 'Erro ao excluir serviço' });
  }
}
