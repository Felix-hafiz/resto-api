import * as dotenv from 'dotenv'
dotenv.config()

import request, { Response } from 'supertest'
import { app } from '../app'
import * as testUtils from './config/testUtils'

const url = '/api/v1/users'
let accessToken: string
let userId: string
let customer: Response

const usersBody = {
    name: 'hafiz',
    email: process.env.ADMIN_EMAIL as string,
    password: 'rahasia123',
}

beforeAll(async () => {
    customer = await testUtils.addCustomerAccount('udin')

    const res = await testUtils.loginUser(usersBody.email, usersBody.password)

    accessToken = res.body.data.accessToken
    userId = customer.body.data._id
})

afterAll(async () => {
    //detele customer dummy account
    await testUtils.deleteUserAccount(customer.body.data.email, accessToken)
})

describe('Users Routes', () => {
    it('should return array of data even it empty', async () => {
        const res = await request(app)
            .get(url)
            .auth(accessToken, { type: 'bearer' })

        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toBeInstanceOf(Array)
    })

    it('should return authentication error message', async () => {
        const responseLogin = await testUtils.loginUser(
            'udin@gmail.com',
            'rahasia123',
        )
        const accessToken = responseLogin.body.data.accessToken

        const res = await request(app)
            .get(url)
            .auth(accessToken, { type: 'bearer' })

        expect(res.statusCode).toEqual(403)
        expect(res.body.error.message).toBeDefined()
    })

    it('should return Error when accessToken not given', async () => {
        const res = await request(app).get(url)
        expect(res.statusCode).toEqual(401)
    })
})

describe('Single User Routes', () => {
    describe('GET user', () => {
        it('should return authentication error message', async () => {
            const responseLogin = await testUtils.loginUser(
                'udin@gmail.com',
                'rahasia123',
            )
            const accessToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .get(`${url}/${userId}`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(403)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return single match object', async () => {
            const res = await request(app)
                .get(`${url}/${userId}`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeDefined()
            expect(res.body.data.password).toBeUndefined()
            expect(res.body.data._id).toEqual(userId)
        })

        it('should return error not found users', async () => {
            const res = await request(app)
                .get(`${url}/123456789012345678901234`)
                .auth(accessToken, { type: 'bearer' })
            expect(res.body.error).toBeDefined()
            expect(res.statusCode).toEqual(404)
        })

        it('should return error when id is not valid mongo id', async () => {
            const res = await request(app)
                .get(`${url}/123`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.body.error).toBeDefined()
            expect(res.statusCode).toEqual(404)
        })
    })

    describe('POST user', () => {
        it('should return 201', async () => {
            const res = await request(app)
                .post(url)
                .send({
                    name: 'asep',
                    email: 'asep@gmail.com',
                    password: 'dsdsdsdsd',
                })
                .auth(accessToken, { type: 'bearer' })

            expect(res.body.data).toBeDefined()
            expect(res.body.data.password).toBeUndefined()
            expect(res.statusCode).toEqual(201)

            await testUtils.deleteUserAccount(res.body.data._id, accessToken)
        })

        it.each([
            { name: 123, email: 123, password: 123 },
            {
                name: 123,
                email: 'hafiz@gmail.com',
                password: 123,
            },
            { name: 'felix', email: 123, password: 123 },
        ])(
            'should return error invalid input',
            async ({ name, email, password }) => {
                const res = await request(app)
                    .post(url)
                    .send({ name, email, password })
                    .auth(accessToken, { type: 'bearer' })

                expect(res.body.error).toBeDefined()
                expect(res.statusCode).toEqual(400)
            },
        )

        it('should return error when duplicate email', async () => {
            const res = await request(app)
                .post(url)
                .send(usersBody)
                .auth(accessToken, { type: 'bearer' })

            expect(res.body.error).toBeDefined()
            expect(res.statusCode).toEqual(400)
        })
    })

    describe('PUT user', () => {
        describe('update partial field', () => {
            it.each([
                { name: 'changed name' },
                { email: 'hafizChange@gmail.com' },
                { password: 'rahasisssaaaa' },
                { name: 'changed name', email: 'hafizChange@gmail.com' },
                {
                    name: 'changed name',
                    email: 'hafizChange@gmail.com',
                    password: 'rahasisaaaa',
                },
                { password: 'rahasisaaaa', email: 'hafizChange@gmail.com' },
            ])('should return success', async ({ name, email, password }) => {
                const res = await request(app)
                    .put(`${url}/${userId}`)
                    .send({ name, email, password })
                    .auth(accessToken, { type: 'bearer' })

                expect(res.statusCode).toEqual(200)
                expect(res.body.data.password).toBeUndefined()
                expect(res.body.data).toBeDefined()
            })

            afterAll(async () => {
                //reset user
                await testUtils.deleteUserAccount(
                    customer.body.data._id,
                    accessToken,
                )

                await testUtils.addCustomerAccount('udin')
            })
        })

        it('should return 404', async () => {
            const res = await request(app)
                .put(`${url}/123456789012345678901234`)
                .send({ name: 'changed name' })
                .auth(accessToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(404)
            expect(res.body.error.message).toBeDefined()
        })

        it.each([
            { name: 123 },
            { email: 123 },
            { name: '12313', email: 1313 },
            { name: 1231, email: 'tetst@gmail.com' },
        ])('should return 400, when invalid value', async ({ name, email }) => {
            const res = await request(app)
                .put(`${url}/${userId}`)
                .send({ name, email })
                .auth(accessToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(400)
            expect(res.body.error).toBeDefined()
        })

        it('should return 403 if update not authorized', async () => {
            const testUser = await testUtils.addCustomerAccount('test2')

            const responseLogin = await testUtils.loginUser(
                'udin@gmail.com',
                'rahasia123',
            )

            const customerToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .put(`${url}/${testUser.body.data._id}`)
                .send({ name: 'changed', email: 'emailchanged@gmail.com' })
                .auth(customerToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(403)
            expect(res.body.error.message).toBeDefined()

            await testUtils.deleteUserAccount(
                testUser.body.data._id,
                accessToken,
            )
        })

        it('should success update without admin role if user update its own account', async () => {
            const testUser = await testUtils.addCustomerAccount('test2')
            const userId = testUser.body.data._id
            const responseLogin = await testUtils.loginUser(
                'test2@gmail.com',
                'rahasia123',
            )
            const customerToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .put(`${url}/${userId}`)
                .send({ name: 'changed', email: 'emailchanged@gmail.com' })
                .auth(customerToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeDefined()
            expect(res.body.data.password).toBeUndefined()

            await testUtils.deleteUserAccount(userId, customerToken)
        })
    })

    describe('DELETE user', () => {
        it('should return 404', async () => {
            const res = await request(app)
                .delete(`${url}/123456789012345678901234`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(404)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return 403 if delete not authorized', async () => {
            const testUser = await testUtils.addCustomerAccount('test2')
            const userId = testUser.body.data._id

            const responseLogin = await testUtils.loginUser(
                'udin@gmail.com',
                'rahasia123',
            )
            const customerToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .delete(`${url}/${userId}`)
                .auth(customerToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(403)
            expect(res.body.error.message).toBeDefined()

            await testUtils.deleteUserAccount(userId, accessToken)
        })

        it('should return success', async () => {
            const testUser = await testUtils.addCustomerAccount('test2')
            const userId = testUser.body.data._id

            const res = await request(app)
                .delete(`${url}/${userId}`)
                .auth(accessToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeUndefined()
            expect(res.body.message).toBeDefined()
        })

        it('should success delete without admin role if user delete its own account', async () => {
            const testUser = await testUtils.addCustomerAccount('test2')
            const userId = testUser.body.data._id
            const responseLogin = await testUtils.loginUser(
                'test2@gmail.com',
                'rahasia123',
            )
            const customerToken = responseLogin.body.data.accessToken

            const res = await request(app)
                .delete(`${url}/${userId}`)
                .auth(customerToken, { type: 'bearer' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeUndefined()
            expect(res.body.message).toBeDefined()
        })
    })
})
