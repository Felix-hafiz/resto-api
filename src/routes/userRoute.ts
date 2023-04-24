import express, { Request, Response } from 'express'
import User from '../models/userModel'

const router = express.Router()

router
    .route('/users/')
    .get(async (req: Request, res: Response) => {
        const data = await User.find()
        res.send(data)
    })
    .put(async (req: Request, res: Response) => {
        res.send('user put route')
    })
    .post((req: Request, res: Response) => {
        res.send('user post route')
    })
    .delete(async (req: Request, res: Response) => {
        res.send('user delete route')
    })

export default router
