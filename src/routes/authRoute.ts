import express from 'express'
import * as userController from '../controllers/userController'

const router = express.Router()

router.post('/register', userController.add)
router.post('/login', userController.login)

export default router
