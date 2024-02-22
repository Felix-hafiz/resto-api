import * as dotenv from 'dotenv'
dotenv.config()
import jwt, { JsonWebTokenError, Secret } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export async function authMiddlerware(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    if (req.path === '/menus' && req.method === 'GET') return next()

    const token = req.headers.authorization?.split(' ')[1]

    try {
        if (!token) throw new JsonWebTokenError('No Authentication Header')
        const decoded = jwt.verify(token, process.env.SECRET_KEY as Secret)
        req.user = decoded
        next()
    } catch (error) {
        next(error)
    }
}

export function generateToken(payload: Omit<IUser, 'password'>) {
    const token = jwt.sign(payload, process.env.SECRET_KEY as Secret, {
        expiresIn: process.env.JWT_EXPIRES,
    })

    if (!token) throw new JsonWebTokenError('Json web token failed')
    return token
}
