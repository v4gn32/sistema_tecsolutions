// src/controllers/clients.controller.js
// CRUD de clientes (contrato/avulso) que o frontend utilizará.

import prisma from '../config/db.js';

export const list = async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const where = q
      ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { cnpj: { contains: q } }] }
      : {};
    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(clients);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar clientes.', detail: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { name, type, email, phone, cnpj, address, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'name é obrigatório.' });

    const client = await prisma.client.create({
      data: {
        name,
        type: type === 'ONE_TIME' ? 'ONE_TIME' : 'CONTRACT',
        email: email || null,
        phone: phone || null,
        cnpj: cnpj || null,
        address: address || null,
        notes: notes || null
      }
    });
    return res.status(201).json(client);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao criar cliente.', detail: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, type, email, phone, cnpj, address, notes } = req.body;

    const data = {};
    if (name) data.name = name;
    if (type) data.type = type === 'ONE_TIME' ? 'ONE_TIME' : 'CONTRACT';
    if (email !== undefined) data.email = email || null;
    if (phone !== undefined) data.phone = phone || null;
    if (cnpj !== undefined) data.cnpj = cnpj || null;
    if (address !== undefined) data.address = address || null;
    if (notes !== undefined) data.notes = notes || null;

    const client = await prisma.client.update({ where: { id }, data });
    return res.json(client);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao atualizar cliente.', detail: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.client.delete({ where: { id } });
    return res.json({ message: 'Cliente removido com sucesso.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover cliente.', detail: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ message: 'Cliente não encontrado.' });
    return res.json(client);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar cliente.', detail: err.message });
  }
};
