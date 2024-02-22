import express from 'express'
import { authMiddlerware } from '../utils/authMiddleware'
import * as menuController from '../controllers/menuController'

const router = express.Router()

router.use(authMiddlerware)
router.route('/menus').get(menuController.getAll).post(menuController.add)

router
    .route('/menus/:id')
    .get(menuController.getOne)
    .put(menuController.update)
    .delete(menuController.remove)

export default router
