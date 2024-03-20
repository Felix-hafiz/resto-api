import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
    name: string
    email: string
    password: string
    role: 'ADMIN' | 'CUSTOMER'
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
    },
})

userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    } catch (error) {
        next(error as Error)
    }
})

userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
    const data: mongoose.UpdateQuery<IUser> | null = this.getUpdate()
    if (data?.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

const userModel = mongoose.model('User', userSchema)

export default userModel
