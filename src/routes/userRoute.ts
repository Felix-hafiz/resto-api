import express, { Request, Response } from 'express'
import User from '../models/userModel'

const router = express.Router()

router
    .route('/users/')
    .get(async (req: Request, res: Response) => {
        const data = await User.find()
        res.send(data)
    })
    .post(async (req: Request, res: Response) => {
        const { name } = req.body
        const data = await User.create({ name })
        res.status(201).send(data)
    })
    .delete(async (req: Request, res: Response) => {
        res.send('user delete route')
    })

export default router
