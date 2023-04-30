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

router
    .route('/users/:id')
    .get(async (req: Request, res: Response) => {
        const data = await User.findById(req.params.id)
        res.send(data)
    })
    .put(async (req: Request, res: Response) => {
        const data = await User.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
        })
        res.send({ message: 'Succes Updating User!', data })
    })
    .delete(async (req: Request, res: Response) => {
        const data = await User.findByIdAndDelete(req.params.id)
        res.send({ message: 'Succes Deleting User!', data })
    })

export default router
