// src/controllers/proposals.controller.js
// => CRUD de propostas e itens, com cálculo de total
import prisma from '../config/db.js';

function calcTotal(items) {
  // soma total dos itens
  return items.reduce((acc, it) => acc + Number(it.total), 0);
}

export async function listProposals(req, res) {
  try {
    const proposals = await prisma.proposal.findMany({
      include: { client: true, user: true, items: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(proposals);
  } catch {
    return res.status(500).json({ message: 'Erro ao listar propostas' });
  }
}

export async function getProposal(req, res) {
  try {
    const { id } = req.params;
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { client: true, user: true, items: { include: { product: true, service: true } } }
    });
    if (!proposal) return res.status(404).json({ message: 'Proposta não encontrada' });
    return res.json(proposal);
  } catch {
    return res.status(400).json({ message: 'Erro ao obter proposta' });
  }
}

export async function createProposal(req, res) {
  try {
    const { clientId, status = 'DRAFT', items = [] } = req.body;
    const userId = req.user.id;

    // cria proposta + itens
    const created = await prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.create({
        data: { clientId, userId, status, total: 0 }
      });

      // cria itens e calcula total
      const createdItems = [];
      for (const it of items) {
        const { type, productId, serviceId, quantity, unitPrice } = it;
        const total = Number(unitPrice) * Number(quantity || 1);

        const item = await tx.proposalItem.create({
          data: {
            proposalId: proposal.id,
            type,
            productId: productId || null,
            serviceId: serviceId || null,
            quantity: quantity || 1,
            unitPrice,
            total
          }
        });
        createdItems.push(item);
      }

      const totalAll = calcTotal(createdItems);
      await tx.proposal.update({ where: { id: proposal.id }, data: { total: totalAll } });

      return tx.proposal.findUnique({
        where: { id: proposal.id },
        include: { client: true, user: true, items: true }
      });
    });

    return res.status(201).json(created);
  } catch (e) {
    return res.status(400).json({ message: 'Erro ao criar proposta' });
  }
}

export async function updateProposalStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // DRAFT, SENT, APPROVED, REJECTED
    const p = await prisma.proposal.update({ where: { id }, data: { status } });
    return res.json(p);
  } catch {
    return res.status(400).json({ message: 'Erro ao atualizar status da proposta' });
  }
}

export async function deleteProposal(req, res) {
  try {
    const { id } = req.params;
    await prisma.proposal.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(400).json({ message: 'Erro ao excluir proposta' });
  }
}
