import { HttpError } from '../../utils/errorHandler'
import orderModel, { IOrder } from '../orderModel'

export async function getAllOrders() {
    return await orderModel.find().populate([
        'user',
        {
            path: 'orderItems',
            populate: { path: 'menu', select: 'name price' },
        },
    ])
}

type OrderPayloadType = Omit<IOrder, 'orderItems'> & {
    orderItems: Array<{
        menu: string
        quantity: number
    }>
}

export async function createOrder(orderPayload: OrderPayloadType) {
    return await orderModel.create(orderPayload)
}

export async function getOrder(orderId: string) {
    const order = await orderModel
        .findById(orderId)
        .populate(['user', 'orderItems.menu'], 'name price')

    if (!order) throw new HttpError(`order:${orderId} Not Found!`, 404)

    return order
}
