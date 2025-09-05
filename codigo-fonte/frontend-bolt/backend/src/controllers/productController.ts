import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Criar produto
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    category,
    brand,
    model,
    price,
    costPrice,
    stockQuantity,
    minStockLevel,
    unit,
    sku,
    barcode,
    isActive
  } = req.body;

  // Verificar se já existe produto com o mesmo nome
  const existingProduct = await prisma.product.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  });

  if (existingProduct) {
    throw new AppError('Já existe um produto com este nome', 400);
  }

  // Verificar se SKU já existe (se fornecido)
  if (sku) {
    const skuExists = await prisma.product.findUnique({
      where: { sku }
    });

    if (skuExists) {
      throw new AppError('Já existe um produto com este SKU', 400);
    }
  }

  // Verificar se código de barras já existe (se fornecido)
  if (barcode) {
    const barcodeExists = await prisma.product.findUnique({
      where: { barcode }
    });

    if (barcodeExists) {
      throw new AppError('Já existe um produto com este código de barras', 400);
    }
  }

  // Criar produto
  const product = await prisma.product.create({
    data: {
      name,
      description,
      category,
      brand,
      model,
      price: parseFloat(price),
      costPrice: costPrice ? parseFloat(costPrice) : null,
      stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
      minStockLevel: minStockLevel ? parseInt(minStockLevel) : 0,
      unit: unit || 'UN',
      sku,
      barcode,
      isActive: isActive !== undefined ? isActive : true
    }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Produto criado com sucesso',
    data: product
  };

  res.status(201).json(response);
});

// Listar produtos
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    category, 
    brand, 
    isActive, 
    minPrice, 
    maxPrice,
    lowStock 
  } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { category: { contains: search as string, mode: 'insensitive' } },
      { brand: { contains: search as string, mode: 'insensitive' } },
      { model: { contains: search as string, mode: 'insensitive' } },
      { sku: { contains: search as string, mode: 'insensitive' } },
      { barcode: { contains: search as string, mode: 'insensitive' } }
    ];
  }
  
  if (category) {
    where.category = { contains: category as string, mode: 'insensitive' };
  }
  
  if (brand) {
    where.brand = { contains: brand as string, mode: 'insensitive' };
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice as string);
    if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
  }

  // Filtro para produtos com estoque baixo - implementação simplificada
  // Para uma implementação completa, seria necessário uma query raw ou buscar todos e filtrar
  // Por enquanto, comentado para evitar erro
  // if (lowStock === 'true') {
  //   // Implementar lógica específica se necessário
  // }

  // Buscar produtos
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            proposalProductItems: true
          }
        }
      }
    }),
    prisma.product.count({ where })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Produtos listados com sucesso',
    data: {
      products,
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

// Buscar produto por ID
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      proposalItems: {
        include: {
          proposal: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          proposalItems: true
        }
      }
    }
  });

  if (!product) {
    throw new AppError('Produto não encontrado', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Produto encontrado',
    data: product
  };

  res.json(response);
});

// Atualizar produto
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    brand,
    model,
    price,
    costPrice,
    stockQuantity,
    minStockLevel,
    unit,
    sku,
    barcode,
    isActive
  } = req.body;

  // Verificar se o produto existe
  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    throw new AppError('Produto não encontrado', 404);
  }

  // Se está atualizando nome, verificar se não existe outro produto com o mesmo nome
  if (name && name !== existingProduct.name) {
    const nameExists = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        id: {
          not: id
        }
      }
    });

    if (nameExists) {
      throw new AppError('Já existe um produto com este nome', 400);
    }
  }

  // Se está atualizando SKU, verificar se não existe outro produto com o mesmo SKU
  if (sku && sku !== existingProduct.sku) {
    const skuExists = await prisma.product.findUnique({
      where: { sku }
    });

    if (skuExists) {
      throw new AppError('Já existe um produto com este SKU', 400);
    }
  }

  // Se está atualizando código de barras, verificar se não existe outro produto com o mesmo código
  if (barcode && barcode !== existingProduct.barcode) {
    const barcodeExists = await prisma.product.findUnique({
      where: { barcode }
    });

    if (barcodeExists) {
      throw new AppError('Já existe um produto com este código de barras', 400);
    }
  }

  // Preparar dados para atualização
  const updateData: any = {};
  
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (brand !== undefined) updateData.brand = brand;
  if (model !== undefined) updateData.model = model;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (costPrice !== undefined) updateData.costPrice = costPrice ? parseFloat(costPrice) : null;
  if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
  if (minStockLevel !== undefined) updateData.minStockLevel = parseInt(minStockLevel);
  if (unit !== undefined) updateData.unit = unit;
  if (sku !== undefined) updateData.sku = sku;
  if (barcode !== undefined) updateData.barcode = barcode;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Atualizar produto
  const product = await prisma.product.update({
    where: { id },
    data: updateData
  });

  const response: ApiResponse = {
    success: true,
    message: 'Produto atualizado com sucesso',
    data: product
  };

  res.json(response);
});

// Deletar produto
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o produto existe
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          proposalItems: true
        }
      }
    }
  });

  if (!existingProduct) {
    throw new AppError('Produto não encontrado', 404);
  }

  // Verificar se o produto está sendo usado em propostas
  if (existingProduct._count.proposalItems > 0) {
    throw new AppError('Não é possível deletar produto que está sendo usado em propostas. Desative o produto em vez de deletá-lo.', 400);
  }

  // Deletar produto
  await prisma.product.delete({
    where: { id }
  });

  const response: ApiResponse = {
    success: true,
    message: 'Produto deletado com sucesso'
  };

  res.json(response);
});

// Ativar/Desativar produto
export const toggleProductStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar se o produto existe
  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    throw new AppError('Produto não encontrado', 404);
  }

  // Alternar status
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: !existingProduct.isActive }
  });

  const response: ApiResponse = {
    success: true,
    message: `Produto ${product.isActive ? 'ativado' : 'desativado'} com sucesso`,
    data: product
  };

  res.json(response);
});

// Atualizar estoque do produto
export const updateProductStock = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, operation, reason } = req.body; // operation: 'add' | 'subtract' | 'set'

  // Verificar se o produto existe
  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    throw new AppError('Produto não encontrado', 404);
  }

  let newQuantity: number;
  
  switch (operation) {
    case 'add':
      newQuantity = existingProduct.stockQuantity + parseInt(quantity);
      break;
    case 'subtract':
      newQuantity = existingProduct.stockQuantity - parseInt(quantity);
      if (newQuantity < 0) {
        throw new AppError('Quantidade em estoque não pode ser negativa', 400);
      }
      break;
    case 'set':
      newQuantity = parseInt(quantity);
      if (newQuantity < 0) {
        throw new AppError('Quantidade em estoque não pode ser negativa', 400);
      }
      break;
    default:
      throw new AppError('Operação inválida. Use: add, subtract ou set', 400);
  }

  // Atualizar estoque
  const product = await prisma.product.update({
    where: { id },
    data: { stockQuantity: newQuantity }
  });

  const response: ApiResponse = {
    success: true,
    message: `Estoque do produto atualizado com sucesso. ${reason ? `Motivo: ${reason}` : ''}`,
    data: {
      product,
      previousQuantity: existingProduct.stockQuantity,
      newQuantity,
      operation,
      reason
    }
  };

  res.json(response);
});

// Listar categorias de produtos
export const getProductCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.product.findMany({
    select: {
      category: true
    },
    where: {
      category: {
        not: null
      }
    },
    distinct: ['category']
  });

  const uniqueCategories = categories
    .map(item => item.category)
    .filter(category => category !== null)
    .sort();

  const response: ApiResponse = {
    success: true,
    message: 'Categorias de produtos listadas com sucesso',
    data: uniqueCategories
  };

  res.json(response);
});

// Listar marcas de produtos
export const getProductBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await prisma.product.findMany({
    select: {
      brand: true
    },
    where: {
      brand: {
        not: null
      }
    },
    distinct: ['brand']
  });

  const uniqueBrands = brands
    .map(item => item.brand)
    .filter(brand => brand !== null)
    .sort();

  const response: ApiResponse = {
    success: true,
    message: 'Marcas de produtos listadas com sucesso',
    data: uniqueBrands
  };

  res.json(response);
});

// Produtos com estoque baixo
export const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      stockQuantity: {
        lte: prisma.product.fields.minStockLevel
      },
      isActive: true
    },
    orderBy: [
      { stockQuantity: 'asc' },
      { name: 'asc' }
    ]
  });

  const response: ApiResponse = {
    success: true,
    message: 'Produtos com estoque baixo listados com sucesso',
    data: products
  };

  res.json(response);
});