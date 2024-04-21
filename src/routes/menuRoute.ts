import express from 'express'
import { authMiddleware } from '../utils/authMiddleware'
import * as menuController from '../controllers/menuController'

const router = express.Router()

router.use(authMiddleware)
router.route('/menus').get(menuController.getAll).post(menuController.add)

router
    .route('/menus/:id')
    .get(menuController.getOne)
    .put(menuController.update)
    .delete(menuController.remove)

export default router
