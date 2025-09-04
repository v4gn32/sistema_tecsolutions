// src/controllers/reports.controller.js
// => CRUD simples de relatórios técnicos
import prisma from '../config/db.js';

export async function listReports(req, res) {
  try {
    const { clientId, type } = req.query;
    const where = {};
    if (clientId) where.clientId = clientId;
    if (type) where.type = type;

    const reports = await prisma.report.findMany({
      where,
      include: { client: true, user: true },
      orderBy: { date: 'desc' }
    });
    return res.json(reports);
  } catch {
    return res.status(500).json({ message: 'Erro ao listar relatórios' });
  }
}

export async function createReport(req, res) {
  try {
    const userId = req.user.id;
    const { clientId, type, date, hours, materials, description, pdfUrl } = req.body;

    const r = await prisma.report.create({
      data: {
        clientId,
        userId,
        type,
        date: date ? new Date(date) : undefined,
        hours,
        materials,
        description,
        pdfUrl
      },
      include: { client: true, user: true }
    });
    return res.status(201).json(r);
  } catch {
    return res.status(400).json({ message: 'Erro ao criar relatório' });
  }
}

export async function deleteReport(req, res) {
  try {
    const { id } = req.params;
    await prisma.report.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(400).json({ message: 'Erro ao excluir relatório' });
  }
}
