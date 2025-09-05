import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateProductStock,
  getProductCategories,
  getProductBrands,
  getLowStockProducts
} from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de produto requerem autenticação
router.use(authenticateToken);

// Rotas CRUD
router.post('/', createProduct);                          // POST /api/products - Criar produto
router.get('/', getProducts);                             // GET /api/products - Listar produtos
router.get('/categories', getProductCategories);         // GET /api/products/categories - Listar categorias
router.get('/brands', getProductBrands);                 // GET /api/products/brands - Listar marcas
router.get('/low-stock', getLowStockProducts);           // GET /api/products/low-stock - Produtos com estoque baixo
router.get('/:id', getProductById);                      // GET /api/products/:id - Buscar produto por ID
router.put('/:id', updateProduct);                       // PUT /api/products/:id - Atualizar produto
router.delete('/:id', deleteProduct);                    // DELETE /api/products/:id - Deletar produto
router.patch('/:id/toggle-status', toggleProductStatus); // PATCH /api/products/:id/toggle-status - Ativar/Desativar produto
router.patch('/:id/stock', updateProductStock);          // PATCH /api/products/:id/stock - Atualizar estoque

export default router;