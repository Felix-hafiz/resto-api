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
        if (req.user.role !== 'ADMIN') throw new HttpError('Forbidden', 403)

        const menuPayload = menuPayloadSchema.parse(req.body)

        const data = await menuService.createMenu(menuPayload)
        res.status(201).json({ data: data })
    } catch (error) {
        next(error)
    }
}

export async function getAll(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await menuService.getAllMenus()
        res.json({ data })
    } catch (err) {
        next(err)
    }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        const menuId = req.params.id as string
        const data = await menuService.getMenu(menuId)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user.role !== 'ADMIN') throw new HttpError('Forbidden', 403)

        const menuPayload = menuPayloadSchema.partial().parse(req.body)

        const menuId = req.params.id as string
        const data = await menuService.updateMenu(menuId, menuPayload)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user.role !== 'ADMIN') throw new HttpError('Forbidden', 403)

        const menuId = req.params.id as string
        const data = await menuService.deleteMenu(menuId)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}
