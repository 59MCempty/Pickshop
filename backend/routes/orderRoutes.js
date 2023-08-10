import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'

import {
    getAllOrders,
    getMyOrders,
    getOrderById,
    addNewOrder,
    updateOrderDeliver,
    updateOrderToPaid
} from '../controllers/orders/orderController.js'

const router = express.Router()

router.route('/').post(protect, addNewOrder).get(protect, admin, getAllOrders)
router.route('/mine').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderDeliver)

export default router

