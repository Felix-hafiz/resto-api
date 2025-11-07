import request from 'supertest'
import { app } from '../app'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const url = '/api/v1/'

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('Auth Route', () => {
    it('should throw error when brycpt fail', async () => {
        const hash = bcrypt.hash as jest.Mock
        hash.mockRejectedValue(new Error('Hashing failed'))

        const res = await request(app).post(`${url}register`).send({
            name: 'asep',
            email: 'asep@gmail.com',
            password: 'dsdsdsdsd',
        })

        expect(res.statusCode).not.toEqual(201)
        expect(bcrypt.hash).toHaveBeenCalled()
        expect(res.statusCode).toEqual(500)

        hash.mockRestore()
    })

    it('should throw error when json web token fail', async () => {
        const sign = jwt.sign as jest.Mock
        const compare = bcrypt.compare as jest.Mock
        compare.mockResolvedValue(true)
        sign.mockReturnValue('')

        await request(app).post(`${url}register`).send({
            name: 'asep',
            email: 'alam@gmail.com',
            password: 'mustbe8char',
        })
        const res = await request(app).post(`${url}login`).send({
            email: 'alam@gmail.com',
            password: 'mustbe8char',
        })

        expect(res.statusCode).not.toEqual(200)
        expect(jwt.sign).toHaveBeenCalled()
    })
})
