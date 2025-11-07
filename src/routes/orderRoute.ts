import express from 'express'
import { authMiddleware } from '../utils/authMiddleware'
import * as orderController from '../controllers/orderController'

const router = express.Router()

router.use(authMiddleware)
router
    .route('/orders')
    .get(orderController.getAll)
    .post(orderController.addOrder)

router.route('/orders/:id').get(orderController.getOrder)

export default router
