import { HttpError } from '../../utils/errorHandler'
import userModel from '../userModel'

export async function createUser(payload: IUser) {
    const data = await userModel.create(payload).catch((err) => {
        // duplicate key
        if (err.code === 11000) {
            throw new HttpError('cannot create user: ' + err, 400)
        }
        throw new Error(err.message)
    })
    data.$set('password', undefined)

    return { data }
}

export async function getAllUsers() {
    const data = await userModel.find()

    return { data }
}

export async function getSingleUser(userId: string) {
    const user = await userModel.findById(userId)

    if (!user) throw new HttpError(`user:${userId} Not Found!`, 404)

    return { data: user }
}

export async function updateUser(userId: string, userPayload: Partial<IUser>) {
    const user = await userModel.findByIdAndUpdate(userId, userPayload, {
        returnDocument: 'after',
    })

    if (!user) throw new HttpError(`user:${userId} Not Found!`, 404)

    return { data: user }
}

export async function deleteUser(userId: string) {
    const user = await userModel.findByIdAndDelete(userId)

    if (!user) throw new HttpError(`user:${userId} Not Found!`, 404)

    return { message: 'User Deleted!' }
}

export async function getUserByEmail(payload: Omit<IUser, 'name' | 'role'>) {
    const user = await userModel
        .findOne({ email: payload.email })
        .select('+password')

    if (!user) throw new HttpError(`user:${payload.email} Not Found!`, 404)

    return user
}
