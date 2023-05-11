import * as dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import { app } from '../app'

const url = '/api/v1/users'

describe('Users Routes', () => {
    it('should return match object', async () => {
        const res = await request(app).get(url)
        const usersBody = [
            {
                name: 'hafiz',
                email: 'hafiz@gmail.com',
                password: 'dsdsdsdsd',
            },
        ]

        expect(res.statusCode).toEqual(200)
        expect(res.body).toMatchObject(usersBody)
    })

    it('should return authentication error message', async () => {
        const errorMsg = {
            message: 'access denied',
        }

        const res = await request(app).get(url)

        expect(res.statusCode).toEqual(403)
        expect(res.body).toMatchObject(errorMsg)
    })
})

describe('Single User Routes', () => {
    describe('GET user', () => {
        it('should return authentication error message', async () => {
            const errorMsg = {
                message: 'access denied',
            }

            const res = await request(app).get(`${url}/123abc`)

            expect(res.statusCode).toEqual(403)
            expect(res.body).toMatchObject(errorMsg)
        })

        it('should return match object', async () => {
            const id = '123abc'
            const res = await request(app).get(`${url}/123abc`)
            const userBody = {
                id,
                name: 'hafiz',
                email: 'hafiz@gmail.com',
                password: 'dsdsdsdsd',
            }

            expect(res.statusCode).toEqual(200)
            expect(res.body).toMatchObject(userBody)
            expect(res.body.id).toEqual(userBody.id)
        })

        it('should return error not found users', async () => {
            const res = await request(app).get(`${url}/000xxx`)
            expect(res.body).toMatchObject({ message: 'Not Found users!' })
            expect(res.statusCode).toEqual(404)
        })
    })

    describe('POST user', () => {
        it('should return 201', async () => {
            const userBody = {
                name: 'hafiz',
                email: 'hafiz@gmail.com',
                password: 'dsdsdsdsd',
            }

            const res = await request(app).post(url).send(userBody)

            expect(res.body).toMatchObject({
                message: 'Created!',
                data: userBody,
            })
            expect(res.statusCode).toEqual(201)
        })

        it('should return error invalid input', async () => {
            const res = await request(app)
                .post(url)
                .send({ name: 123, email: 131333, password: 1311 })

            expect(res.body).toMatchObject({ message: 'Invalid input' })
            expect(res.statusCode).toEqual(400)
        })
    })

    describe('PUT user', () => {
        it('should return success', async () => {
            const res = await request(app)
                .put(`${url}/123abc`)
                .send({ name: 'changed name' })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toMatchObject({
                message: 'SUCCESS - upadated user',
            })
        })

        it('should return 404', async () => {
            const res = await request(app)
                .put(`${url}/000xxx`)
                .send({ name: 'changed name' })
            expect(res.statusCode).toEqual(404)
            expect(res.body).toMatchObject({ message: 'user Not Found!' })
        })
        it('should return 400', async () => {
            const res = await request(app)
                .put(`${url}/123abc`)
                .send({ name: 1212222 })
            expect(res.statusCode).toEqual(400)
            expect(res.body).toMatchObject({ message: 'Invalid input' })
        })
    })

    describe('DELETE user', () => {
        it('should return success', async () => {
            const res = await request(app).delete(`${url}/123abc`)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toMatchObject({
                message: 'SUCCESS - deleting user',
            })
        })

        it('should return 404', async () => {
            const res = await request(app).put(`${url}/000xxx`)
            expect(res.statusCode).toEqual(404)
            expect(res.body).toMatchObject({ message: 'user Not Found!' })
        })
    })
})
