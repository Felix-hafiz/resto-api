import request from 'supertest'
import { app } from '../../app'

export async function addCustomerAccount(customerName: string) {
    const customer = {
        name: customerName,
        email: `${customerName}@gmail.com`,
        password: 'rahasia',
    }
    return await request(app).post('/api/v1/register').send(customer)
}

export async function addAdminAccount() {
    const admin = {
        name: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: 'rahasia',
    }
    return await request(app).post('/api/v1/register').send(admin)
}

export async function loginUser(email: string, password: string) {
    return await request(app).post('/api/v1/login').send({ email, password })
}

export async function deleteUserAccount(userId: string, token: string) {
    return await request(app)
        .delete(`/api/v1/users/${userId}`)
        .auth(token, { type: 'bearer' })
}
