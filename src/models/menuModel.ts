import mongoose from 'mongoose'

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

export default mongoose.model('Menu', menuSchema)
