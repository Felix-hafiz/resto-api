import { Request, Response, NextFunction } from 'express'
import * as orderService from '../models/services/orderService'
import { z } from 'zod'
import { HttpError } from '../utils/errorHandler'

const orderPayloadSchema = z.object({
    orderItems: z
        .array(
            z.object({
                menu: z.string(),
                quantity: z.number().min(1),
            }),
        )
        .nonempty(),
    user: z.string(),
})

export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        let data
        if (req.user.role !== 'ADMIN') {
            data = await orderService.getAllOrders({ user: req.user._id })
        } else {
            data = await orderService.getAllOrders()
        }

        res.json({ data })
    } catch (err) {
        next(err)
    }
}

export async function addOrder(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const orderPayload = orderPayloadSchema.parse(req.body)

        if (req.user.role !== 'ADMIN') {
            if (req.user._id === req.body.user) {
                const data = await orderService.createOrder(orderPayload)
                res.status(201).json({ data: data })
            }

            throw new HttpError('Forbidden', 403)
        }

        const data = await orderService.createOrder(orderPayload)

        res.status(201).json({ data: data })
    } catch (error) {
        next(error)
    }
}

export async function getOrder(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const orderId = req.params.id as string

        let data
        if (req.user.role !== 'ADMIN') {
            data = await orderService.getOrder(orderId, {
                user: req.user._id,
            })
        } else {
            data = await orderService.getOrder(orderId)
        }

        res.json({ data })
    } catch (error) {
        next(error)
    }
}
