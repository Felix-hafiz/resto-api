import express from 'express'
import { authMiddleware } from '../utils/authMiddleware'
import * as userController from '../controllers/userController'

const router = express.Router()

router.use(authMiddleware)
router.route('/users/').get(userController.getAll).post(userController.add)

router
    .route('/users/:id')
    .get(userController.getUser)
    .put(userController.update)
    .delete(userController.remove)

export default router
