import * as dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'

const url = '/api/v1/users'
let token: string
let userId: string

const usersBody = {
    name: 'hafiz',
    email: process.env.ADMIN_EMAIL,
    password: 'rahasia',
}

beforeAll(async () => {
    await request(app)
        .post('/api/v1/register')
        .send({ name: 'udin', email: 'udin@gmail.com', password: '123' })

    const user = await request(app).post('/api/v1/register').send(usersBody)
    const res = await request(app)
        .post('/api/v1/login')
        .send({ email: usersBody.email, password: usersBody.password })
    token = res.body.data.token
    userId = user.body.data._id
})

describe('Users Routes', () => {
    it('should return array of data even it empty', async () => {
        const res = await request(app).get(url).auth(token, { type: 'bearer' })

        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toBeInstanceOf(Array)
    })

    it('should return authentication error message', async () => {
        const responseLogin = await request(app)
            .post('/api/v1/login')
            .send({ email: 'udin@gmail.com', password: '123' })

        const token = responseLogin.body.data.token

        const res = await request(app).get(url).auth(token, { type: 'bearer' })

        expect(res.statusCode).toEqual(403)
        expect(res.body.error.message).toBeDefined()
    })

    it('should return Error when token not given', async () => {
        const res = await request(app).get(url)
        expect(res.statusCode).toEqual(401)
    })
})

describe('Single User Routes', () => {
    describe('GET user', () => {
        it('should return authentication error message', async () => {
            const responseLogin = await request(app)
                .post('/api/v1/login')
                .send({ email: 'udin@gmail.com', password: '123' })

            const token = responseLogin.body.data.token

            const res = await request(app)
                .get(`${url}/${userId}`)
                .auth(token, { type: 'bearer' })

            expect(res.statusCode).toEqual(403)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return single match object', async () => {
            const res = await request(app)
                .get(`${url}/${userId}`)
                .auth(token, { type: 'bearer' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeDefined()
            expect(res.body.data.password).toBeUndefined()
            expect(res.body.data._id).toEqual(userId)
        })

        it('should return error not found users', async () => {
            const res = await request(app)
                .get(`${url}/123456789012345678901234`)
                .auth(token, { type: 'bearer' })
            expect(res.body.error).toBeDefined()
            expect(res.statusCode).toEqual(404)
        })

        it('should return error when id is not valid mongo id', async () => {
            const res = await request(app)
                .get(`${url}/123`)
                .auth(token, { type: 'bearer' })

            expect(res.body.error).toBeDefined()
            expect(res.statusCode).toEqual(404)
        })
    })

    describe('POST user', () => {
        it('should return 201', async () => {
            const userBody = {
                name: 'asep',
                email: 'asep@gmail.com',
                password: 'dsdsdsdsd',
            }

            const res = await request(app)
                .post(url)
                .send(userBody)
                .auth(token, { type: 'bearer' })

            expect(res.body.data).toBeDefined()
            expect(res.body.data.password).toBeUndefined()
            expect(res.statusCode).toEqual(201)
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
                    .auth(token, { type: 'bearer' })

                expect(res.body.error).toBeDefined()
                expect(res.statusCode).toEqual(400)
            },
        )

        it('should return error when duplicate email', async () => {
            const res = await request(app)
                .post(url)
                .send(usersBody)
                .auth(token, { type: 'bearer' })

            expect(res.body.error).toBeDefined()
            expect(res.statusCode).toEqual(400)
        })
    })

    describe('PUT user', () => {
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
                .auth(token, { type: 'bearer' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.data.password).toBeUndefined()
            expect(res.body.data).toBeDefined()
        })

        it('should return 404', async () => {
            const res = await request(app)
                .put(`${url}/123456789012345678901234`)
                .send({ name: 'changed name' })
                .auth(token, { type: 'bearer' })
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
                .auth(token, { type: 'bearer' })
            expect(res.statusCode).toEqual(400)
            expect(res.body.error).toBeDefined()
        })
    })

    describe('DELETE user', () => {
        it('should return 404', async () => {
            const res = await request(app)
                .delete(`${url}/123456789012345678901234`)
                .auth(token, { type: 'bearer' })
            expect(res.statusCode).toEqual(404)
            expect(res.body.error.message).toBeDefined()
        })

        it('should return success', async () => {
            const res = await request(app)
                .delete(`${url}/${userId}`)
                .auth(token, { type: 'bearer' })
            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeUndefined()
            expect(res.body.message).toBeDefined()
        })
    })
})
