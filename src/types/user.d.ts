namespace Express {
    interface Request {
        user?: any
    }
}

interface IUser {
    name: string
    email: string
    password: string
    role: 'ADMIN' | 'CUSTOMER'
}
