import { Request, Response, NextFunction } from 'express'
import * as userService from '../models/services/userService'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/authMiddleware'
import { HttpError } from '../utils/errorHandler'

const userPayloadSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

export async function add(req: Request, res: Response, next: NextFunction) {
    try {
        const userPayload = userPayloadSchema.parse(req.body)
        let role: IUser['role']
        if (req.body.email === process.env.ADMIN_EMAIL) {
            role = 'ADMIN'
        } else {
            role = 'CUSTOMER'
        }
        const data = await userService.createUser({
            ...userPayload,
            role,
        })
        res.status(201).json(data)
    } catch (error) {
        next(error)
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user.role !== 'ADMIN') throw new HttpError('Forbidden', 403)
        const data = await userService.getAllUsers()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user.role !== 'ADMIN') throw new HttpError('Forbidden', 403)
        if (!req.params.id) throw new HttpError('ID Not Found', 404)

        const data = await userService.getSingleUser(req.params.id)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const userPayload = userPayloadSchema.partial().parse(req.body)

        if (!req.params.id) throw new HttpError('ID Not Found', 404)

        const data = await userService.updateUser(req.params.id, userPayload)

        res.json(data)
    } catch (error) {
        next(error)
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) throw new HttpError('ID Not Found', 404)

        const data = await userService.deleteUser(req.params.id)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const userPayload = userPayloadSchema
            .omit({ name: true })
            .parse(req.body)

        const user = await userService.getUserByEmail(userPayload)

        const isValid = await bcrypt.compare(
            userPayload.password,
            user.password,
        )

        if (!isValid) throw new HttpError('password wrong!!', 400)

        const token = generateToken(user.$set('password', undefined).toObject())

        res.json({ data: { token } })
    } catch (error) {
        next(error)
    }
}
