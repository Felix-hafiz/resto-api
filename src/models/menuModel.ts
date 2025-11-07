import mongoose from 'mongoose'

export interface IMenu {
    name: string
    description?: string
    price: number
    category: 'food' | 'drink'
}

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'drink'],
    },
})

export default mongoose.model<IMenu>('Menu', menuSchema)
