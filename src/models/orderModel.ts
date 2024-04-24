import mongoose from 'mongoose'
import { HttpError } from '../utils/errorHandler'
import { IMenu } from './menuModel'

export interface IOrder {
    orderItems: Array<{
        menu: mongoose.Types.ObjectId
        quantity: number
    }>
    user: string
}

const orderItems = new mongoose.Schema(
    {
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true,
        },
        quantity: { type: Number, required: true },
    },
    { _id: false },
)

const orderSchema = new mongoose.Schema(
    {
        orderItems: [orderItems],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
)

orderSchema.pre('save', async function (next) {
    try {
        const doc = await this.populate<{
            orderItems: Array<{ menu: IMenu; quantity: number }>
        }>('orderItems.menu')

        let totalPrice = 0

        for (const orderItem of doc.orderItems) {
            const menuItem = orderItem.menu

            if (menuItem) {
                totalPrice += menuItem.price * orderItem.quantity
            } else {
                throw new HttpError(
                    'Some menu item not found, check again!',
                    404,
                )
            }
        }

        this.totalPrice = totalPrice

        next()
    } catch (error) {
        next(error as Error)
    }
})

export default mongoose.model<IOrder>('Order', orderSchema)
