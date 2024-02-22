import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as menuService from '../models/services/menuService'
import { HttpError } from '../utils/errorHandler'

const menuPayloadSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    category: z.enum(['food', 'drink']),
})

export async function add(req: Request, res: Response, next: NextFunction) {
    try {
        const menuPayload = menuPayloadSchema.parse(req.body)

        const data = await menuService.createMenu(menuPayload)
        res.status(201).json(data)
    } catch (error) {
        next(error)
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await menuService.getAllMenus()
        res.json({ data })
    } catch (err) {
        next(err)
    }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) throw new HttpError('ID Not Found', 404)

        const data = await menuService.getMenu(req.params.id)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) throw new HttpError('ID Not Found', 404)

        const menuPayload = menuPayloadSchema.partial().parse(req.body)

        const data = await menuService.updateMenu(req.params.id, menuPayload)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) throw new HttpError('ID Not Found', 404)

        const data = await menuService.deleteMenu(req.params.id)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}
