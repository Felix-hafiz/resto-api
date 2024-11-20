import { HttpError } from '../../utils/errorHandler'
import orderModel, { IOrder } from '../orderModel'

type TOrderPayload = Omit<IOrder, 'orderItems'> & {
    orderItems: Array<{
        menu: string
        quantity: number
    }>
}

type TUserId = { user: string } | Record<string, never>

export async function getAllOrders(userId: TUserId = {}) {
    return await orderModel
        .find()
        .where(userId)
        .populate([
            'user',
            {
                path: 'orderItems',
                populate: { path: 'menu', select: 'name price' },
            },
        ])
}

export async function createOrder(orderPayload: TOrderPayload) {
    return await orderModel.create(orderPayload)
}

export async function getOrder(orderId: string, userId: TUserId = {}) {
    const order = await orderModel
        .findById(orderId)
        .where(userId)
        .populate([
            'user',
            {
                path: 'orderItems',
                populate: { path: 'menu', select: 'name price' },
            },
        ])

    if (!order) throw new HttpError(`order:${orderId} Not Found!`, 404)

    return order
}
