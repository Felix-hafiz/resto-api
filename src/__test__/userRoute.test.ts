import request from 'supertest'
import { app } from '../app'

describe('User Routes', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/api/user')
        expect(res.statusCode).toEqual(200)
    })

    it('should return match object', async () => {
        const res = await request(app).get('/api/user')
        const userBody = {
            name: 'hafiz',
            email: 'hafiz@gmail.com',
            password: 'dsdsdsdsd',
        }
        expect(res.body).toMatchObject(userBody)
    })

    it('should return error message', async () => {
        const errorMsg = {
            message: 'users not found!',
        }
        const res = await request(app).get('/api/user')
        expect(res.statusCode).toEqual(404)
        expect(res.body).toMatchObject(errorMsg)
    })
})
