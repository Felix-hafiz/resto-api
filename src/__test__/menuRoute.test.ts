import request, { Response } from 'supertest'
import { app } from '../app'
import * as testUtils from './config/testUtils'
import * as menuService from '../models/services/menuService'
let accessToken: string
let menuId: string
let customer: Response

const usersBody = {
    name: 'hafiz',
    email: process.env.ADMIN_EMAIL as string,
    password: 'rahasia123',
}

beforeAll(async () => {
    customer = await testUtils.addCustomerAccount('ujang')

    const res = await testUtils.loginUser(usersBody.email, usersBody.password)

    accessToken = res.body.data.accessToken
})

afterAll(async () => {
    //detele customer dummy account
    await testUtils.deleteUserAccount(customer.body.data.email, accessToken)

    jest.restoreAllMocks()
})

describe('Menu Routes', () => {
    describe('POST', () => {
        it('should return 401', async () => {
            const res = await request(app)
                .post(`/api/v1/menus/${menuId}`)
                .send({
                    name: 'test menu title',
                    price: 99999,
                    category: 'food',
                })

            expect(res.status).toBe(401)
            expect(res.body.error).toBeDefined()
        })

        it('should return 403 if user is not admin', async () => {
            const responseLogin = await testUtils.loginUser(
                'ujang@gmail.com',
                'rahasia123',
            )

            const accessToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .post('/api/v1/menus')
                .auth(accessToken, { type: 'bearer' })
                .send({
                    name: 'test menu title',
                    price: 10000,
                    category: 'food',
                })

            expect(res.status).toBe(403)
            expect(res.body.error.message).toBeDefined()
        })

        it.each([
            { name: 'test menu title' },
            { name: true, price: 10000, category: 'food' },
            { name: 'test menu title', price: '1000', category: 'food' },
            { name: 'test menu title', price: 1000, category: 'vehicle' },
        ])(
            'should return 400 if input invalid',
            async ({ name, price, category }) => {
                const res = await request(app)
                    .post('/api/v1/menus')
                    .auth(accessToken, { type: 'bearer' })
                    .send({
                        name,
                        price,
                        category,
                    })

                expect(res.status).toBe(400)
                expect(res.body.error).toBeDefined()
            },
        )

        it('should return 201', async () => {
            const res = await request(app)
                .post('/api/v1/menus')
                .auth(accessToken, { type: 'bearer' })
                .send({
                    name: 'test menu title',
                    price: 10000,
                    category: 'food',
                })
            menuId = res.body.data._id
        })
    })

    describe('GET', () => {
        it('should return all menu items', async () => {
            const res = await request(app).get('/api/v1/menus')

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
            expect(res.body.data).toBeInstanceOf(Array)
        })

        it('should return single menu items', async () => {
            const res = await request(app).get(`/api/v1/menus/${menuId}`)

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
        })

        it('should return 404', async () => {
            const res = await request(app).get(
                '/api/v1/menus/123456789012345678901234',
            )

            expect(res.status).toBe(404)
            expect(res.body.error).toBeDefined()
        })

        it('should return 500 if get menu failed', async () => {
            const spy = jest.spyOn(menuService, 'getAllMenus')
            spy.mockRejectedValue(new Error('error'))

            const res = await request(app).get('/api/v1/menus')

            expect(spy).toHaveBeenCalled()
            expect(res.status).toBe(500)
            expect(res.body.error).toBeDefined()
        })
    })

    describe('PUT', () => {
        it('should return 404 when id not found', async () => {
            const res = await request(app)
                .put('/api/v1/menus/123456789012345678901234')
                .auth(accessToken, { type: 'bearer' })
                .send({
                    name: 'test menu title (updated)',
                    price: 10000,
                    category: 'food',
                })

            expect(res.status).toBe(404)
            expect(res.body.error).toBeDefined()
        })

        it('should return 401 when auth header not exist', async () => {
            const res = await request(app).put(`/api/v1/menus/${menuId}`).send({
                name: 'test menu title (updated)',
                price: 99999,
                category: 'food',
            })

            expect(res.status).toBe(401)
            expect(res.body.error).toBeDefined()
        })

        it('should return 403 if user is not admin', async () => {
            const responseLogin = await testUtils.loginUser(
                'ujang@gmail.com',
                'rahasia123',
            )
            const res = await request(app)
                .put(`/api/v1/menus/${menuId}`)
                .auth(responseLogin.body.data.accessToken, { type: 'bearer' })
                .send({
                    name: 'test menu title (updated)',
                    price: 10000,
                    category: 'food',
                })

            expect(res.status).toBe(403)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return 200', async () => {
            const res = await request(app)
                .put(`/api/v1/menus/${menuId}`)
                .auth(accessToken, { type: 'bearer' })
                .send({
                    name: 'test menu title (updated)',
                    price: 5000,
                    category: 'drink',
                })

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
        })
    })

    describe('DELETE', () => {
        it('should return 401 when auth header not exist', async () => {
            const res = await request(app).delete(`/api/v1/menus/${menuId}`)

            expect(res.status).toBe(401)
            expect(res.body.error).toBeDefined()
        })

        it('should return 403 if user is not admin', async () => {
            const responseLogin = await testUtils.loginUser(
                'ujang@gmail.com',
                'rahasia123',
            )
            const accessToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .delete(`/api/v1/menus/${menuId}`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.status).toBe(403)
            expect(res.body.error).toBeDefined()
        })

        it('should return 404 when id not found', async () => {
            const res = await request(app)
                .delete('/api/v1/menus/123456789012345678901234')
                .auth(accessToken, { type: 'bearer' })

            expect(res.status).toBe(404)
            expect(res.body.error).toBeDefined()
        })

        it('should return 200', async () => {
            const res = await request(app)
                .delete(`/api/v1/menus/${menuId}`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
        })
    })
})
