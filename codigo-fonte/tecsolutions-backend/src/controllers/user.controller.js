// src/controllers/user.controller.js
// Administração de usuários (lista, cria, edita, remove) - somente ADMIN.

import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

export const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar usuários.', detail: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email e password são obrigatórios.' });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'E-mail já cadastrado.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: role === 'ADMIN' ? 'ADMIN' : 'TECH'
      },
      select: { id: true, name: true, email: true, role: true }
    });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao criar usuário.', detail: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (role) data.role = role === 'ADMIN' ? 'ADMIN' : 'TECH';
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true }
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao atualizar usuário.', detail: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'Usuário removido com sucesso.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover usuário.', detail: err.message });
  }
};
