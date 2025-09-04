// src/controllers/products.controller.js
// => CRUD de produtos
import prisma from '../config/db.js';

export async function listProducts(req, res) {
  try {
    const { q } = req.query;
    const products = await prisma.product.findMany({
      where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(products);
  } catch {
    return res.status(500).json({ message: 'Erro ao listar produtos' });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, sku, price } = req.body;
    const p = await prisma.product.create({ data: { name, description, sku, price } });
    return res.status(201).json(p);
  } catch {
    return res.status(400).json({ message: 'Erro ao criar produto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const p = await prisma.product.update({ where: { id }, data: req.body });
    return res.json(p);
  } catch {
    return res.status(400).json({ message: 'Erro ao atualizar produto' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(400).json({ message: 'Erro ao excluir produto' });
  }
}
