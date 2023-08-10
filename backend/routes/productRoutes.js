import express from 'express'
import { getProducts, getProductById, createdProduct, editProduct, deleteProduct, createReview, getTopProducts } from '../controllers/products/productsController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// mongoose methods are async --> await models method
router.route('/').get(getProducts).post(protect, admin, createdProduct)
router.route('/top').get(getTopProducts)
router.route('/:id').get(getProductById).put(protect, admin, editProduct).delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createReview)


export default router


