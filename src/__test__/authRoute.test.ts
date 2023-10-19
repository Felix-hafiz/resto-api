import request from 'supertest'
import { app } from '../app'

const url = '/api/v1/'
type TUSerPayload = Partial<Record<string, string>>
const userPayload: TUSerPayload = {
    name: 'test',
    email: 'test@gmail.com',
    password: 'test',
}

describe('Auth Route', () => {
    it.each([
        { name: 123, email: 123, password: 123 },
        {
            name: 123,
            email: 'hafiz@gmail.com',
            password: 123,
        },
        { name: 'felix', email: 123, password: 123 },
    ])('should fail, invalid payload', async (userPayload) => {
        const res = await request(app)
            .post(url + 'register')
            .send(userPayload)
        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })

    it('should register user without auth', async () => {
        const res = await request(app)
            .post(url + 'register')
            .send(userPayload)

        expect(res.status).toBe(201)
        expect(res.body.data).toBeDefined()
    })

    it('should return NotFound when login with false email', async () => {
        delete userPayload.name
        const res = await request(app)
            .post(url + 'login')
            .send({
                email: 'testSalah@gmail.com',
                password: userPayload.password,
            })

        expect(res.status).toEqual(404)
        expect(res.body.error.message).toBeDefined()
    })

    it('should return error when login with false password', async () => {
        const res = await request(app)
            .post(url + 'login')
            .send({ email: userPayload.email, password: 'salah' })

        expect(res.status).toEqual(400)
        expect(res.body.error.message).toBeDefined()
    })

    it('should return token when login', async () => {
        const res = await request(app)
            .post(url + 'login')
            .send(userPayload)

        expect(res.status).toEqual(200)
        expect(res.body.data.token).toBeDefined()
    })
})
