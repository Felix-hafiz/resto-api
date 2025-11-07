import * as dotenv from 'dotenv'
dotenv.config()
import jwt, { JsonWebTokenError, JwtPayload, Secret } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export async function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    const exeptPath = /\/menus\/?.*/.exec(req.path)
    if (req.method === 'GET' && req.path === exeptPath?.input) return next()

    const token = req.headers.authorization?.split(' ')[1]

    try {
        if (!token) throw new JsonWebTokenError('No Authentication Header')
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
        )
        req.user = decoded
        next()
    } catch (error) {
        next(error)
    }
}

export function generateAccessToken(payload: JwtPayload) {
    const token = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
        } as jwt.SignOptions,
    )

    if (!token) throw new JsonWebTokenError('Json web token failed')
    return token
}

export function generateRefreshToken(payload: JwtPayload) {
    const token = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET_KEY as Secret,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
        } as jwt.SignOptions,
    )

    if (!token) throw new JsonWebTokenError('Json web token failed')
    return token
}
