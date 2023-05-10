import mongoose from 'mongoose'

beforeAll(async () => {
    await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test'
    )
})

afterAll(async () => {
    await mongoose.disconnect()
})
