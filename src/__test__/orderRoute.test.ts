import request, { Response } from 'supertest'
import { app } from '../app'
import * as testUtils from './config/testUtils'
import jwt from 'jsonwebtoken'

const url = '/api/v1/orders'

let token: string
let menuId: string
let customer: Response

beforeAll(async () => {
    customer = await testUtils.addCustomerAccount('orderCustomer1')

    const res = await testUtils.loginUser(
        process.env.ADMIN_EMAIL as string,
        'rahasia',
    )

    token = res.body.data.token

    const resMenu = await request(app)
        .post('/api/v1/menus')
        .send({
            name: 'test menu title',
            price: 99999,
            category: 'food',
        })
        .auth(token, { type: 'bearer' })

    menuId = resMenu.body.data._id
})

afterAll(async () => {
    //detele customer dummy account
    await testUtils.deleteUserAccount(customer.body.data.email, token)
})

describe('Order Routes', () => {
    let orderId: string

    describe('POST', () => {
        it('should return 401, unauthorized when user not login', async () => {
            const res = await request(app).post(url).send({
                menuId: '123456789012345678901234',
                quantity: 1,
            })

            expect(res.status).toBe(401)
            expect(res.body.error).toBeDefined()
        })

        it('should return 403 if user is not admin or not customer itself', async () => {
            const responseLoginCustomer = await testUtils.loginUser(
                'orderCustomer1@gmail.com',
                'rahasia',
            )

            const tokenCustomer = responseLoginCustomer.body.data.token

            const res = await request(app)
                .post(url)
                .auth(tokenCustomer, { type: 'bearer' })
                .send({
                    orderItems: [
                        {
                            menu: menuId,
                            quantity: 1,
                        },
                    ],
                    user: '123456789012345678901234',
                })

            expect(res.status).toBe(403)
            expect(res.body.error.message).toBeDefined()
        })

        it.each([
            { menuId: '123456789012345678901234', quantity: 1 },
            {
                orderItems: [{ menu: '123456789012345678901234', quantity: 1 }],
            },
            { user: '123456789012345678901234' },
            {
                orderItems: [
                    { menu: '123456789012345678901234', quantity: '1' },
                ],
                user: '123456789012345678901234',
            },
            {
                orderItems: [
                    { menu: '123456789012345678901234', quantity: '1' },
                ],
                user: 123456789012,
            },
            {
                orderItems: [{ menu: 123456789012, quantity: 1 }],
                user: '123456789012345678901234',
            },
            {
                orderItems: [{ menu: '123456789012345678901234', quantity: 0 }],
                user: '123456789012345678901234',
            },
        ])(
            'should return 400 if input invalid',
            async ({ orderItems, user }) => {
                const res = await request(app)
                    .post(url)
                    .auth(token, { type: 'bearer' })
                    .send({
                        orderItems,
                        user,
                    })

                expect(res.status).toBe(400)
                expect(res.body.error).toBeDefined()
            },
        )

        it('should return 404 if menu not found', async () => {
            const res = await request(app)
                .post(url)
                .auth(token, { type: 'bearer' })
                .send({
                    orderItems: [
                        {
                            menu: '123456789012345678901234',
                            quantity: 1,
                        },
                    ],
                    user: '123456789012345678901234',
                })

            expect(res.status).toBe(404)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return 403 if customer make order for other customer', async () => {
            const responseLoginCustomer = await testUtils.loginUser(
                'orderCustomer1@gmail.com',
                'rahasia',
            )

            const otherCustomer = jwt.decode(token) as jwt.JwtPayload
            const tokenCustomer = responseLoginCustomer.body.data.token //current customer
            const res = await request(app)
                .post(url)
                .auth(tokenCustomer, { type: 'bearer' })
                .send({
                    orderItems: [
                        {
                            menu: menuId,
                            quantity: 1,
                        },
                    ],
                    user: otherCustomer._id,
                })

            expect(res.status).toBe(403)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return 201, when user is admin', async () => {
            const res = await request(app)
                .post(url)
                .auth(token, { type: 'bearer' })
                .send({
                    orderItems: [
                        {
                            menu: menuId,
                            quantity: 1,
                        },
                    ],
                    user: '123456789012345678901234',
                })

            orderId = res.body.data._id
            expect(res.status).toBe(201)
            expect(res.body.data).toBeDefined()
        })

        it('should return 201, when user order for himself even if user is not admin', async () => {
            const responseLoginCustomer = await testUtils.loginUser(
                'orderCustomer1@gmail.com',
                'rahasia',
            )

            const tokenCustomer = responseLoginCustomer.body.data.token

            const res = await request(app)
                .post(url)
                .auth(tokenCustomer, { type: 'bearer' })
                .send({
                    orderItems: [
                        {
                            menu: menuId,
                            quantity: 1,
                        },
                    ],
                    user: customer.body.data._id,
                })

            expect(res.status).toBe(201)
            expect(res.body.data).toBeDefined()
        })
    })

    describe('GET', () => {
        it('should return 401, if user not login', async () => {
            const res = await request(app).get(url)

            expect(res.status).toBe(401)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return 404, if user order not found', async () => {
            const responseLoginCustomer = await testUtils.loginUser(
                'orderCustomer1@gmail.com',
                'rahasia',
            )

            const tokenCustomer = responseLoginCustomer.body.data.token
            const res = await request(app)
                .get(`${url}/${orderId}`)
                .auth(tokenCustomer, { type: 'bearer' })

            expect(res.status).toBe(404)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return 200 when user is admin', async () => {
            const res = await request(app)
                .get(url)
                .auth(token, { type: 'bearer' })

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
        })

        it('should return 200, if customer order exist', async () => {
            const res = await request(app)
                .get(`${url}/${orderId}`)
                .auth(token, { type: 'bearer' })

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
        })
    })
})
