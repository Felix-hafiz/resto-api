import request from 'supertest'
import { app } from '../app'

describe('Users Routes', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/api/users')
        expect(res.statusCode).toEqual(200)
    })

    it('should return match object', async () => {
        const res = await request(app).get('/api/users')
        const usersBody = [
            {
                name: 'hafiz',
                email: 'hafiz@gmail.com',
                password: 'dsdsdsdsd',
            },
        ]
        expect(res.body).toMatchObject(usersBody)
    })

    it('should return authentication error message', async () => {
        const errorMsg = {
            message: 'access denied',
        }
        const res = await request(app).get('/api/users')
        expect(res.statusCode).toEqual(403)
        expect(res.body).toMatchObject(errorMsg)
    })
})

describe('Single User Routes', () => {
    describe('GET user', () => {
        it('should return 200', async () => {
            const res = await request(app).get('/api/users/123abc')
            expect(res.statusCode).toEqual(200)
        })

        it('should return authentication error message', async () => {
            const errorMsg = {
                message: 'access denied',
            }
            const res = await request(app).get('/api/users/123abc')
            expect(res.statusCode).toEqual(403)
            expect(res.body).toMatchObject(errorMsg)
        })

        it('should return match object', async () => {
            const id = '123abc'
            const res = await request(app).get(`/api/users/${id}`)
            const userBody = {
                id,
                name: 'hafiz',
                email: 'hafiz@gmail.com',
                password: 'dsdsdsdsd',
            }
            expect(res.body).toMatchObject(userBody)
            expect(res.body.id).toEqual(userBody.id)
        })

        it('should return error not found users', async () => {
            const res = await request(app).get('/api/users/000xxxx')
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
            const res = await request(app).post('/api/users').send(userBody)
            expect(res.body).toMatchObject({ message: 'Created!', ...userBody })
            expect(res.statusCode).toEqual(201)
        })

        it('should return error invalid input', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ name: 123, email: 131333, password: 1311 })
            expect(res.body).toMatchObject({ message: 'Invalid input' })
            expect(res.statusCode).toEqual(400)
        })
    })
})
