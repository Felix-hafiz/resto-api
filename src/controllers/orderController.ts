import { Request, Response, NextFunction } from 'express'
import * as orderService from '../models/services/orderService'
import { z } from 'zod'

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

export async function getAll(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await orderService.getAllOrders()

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
        const data = await orderService.getOrder(orderId)

        res.json({ data })
    } catch (error) {
        next(error)
    }
}
