import { ZodError } from 'zod'
import { MongooseError } from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'

export class HttpError extends Error {
    constructor(
        message: string,
        public status: number,
    ) {
        super(message)
    }
}

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof HttpError) {
        res.status(err.status).json({ error: { message: err.message } })
    } else if (err instanceof ZodError) {
        res.status(400).json({ error: err.issues })
    } else if (err instanceof MongooseError) {
        // if request params is not mongo id
        res.status(404).json({ error: err })
    } else if (err instanceof JsonWebTokenError) {
        res.status(401).json({ error: err })
    } else {
        res.status(500).json({
            error: {
                message: err.message,
                stack: err.stack,
            },
        })
    }
}
