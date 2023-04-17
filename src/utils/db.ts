import mongoose from 'mongoose'

try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0:27017')
    console.info('db connected')
} catch (error) {
    console.error(`mongodb unConnected!!!, Error:${error}`)
}
