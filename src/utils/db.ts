import mongoose from 'mongoose'

try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0:27017')
    // eslint-disable-next-line no-console
    console.info('db connected')
} catch (error) {
    // eslint-disable-next-line no-console
    console.error(`mongodb unConnected!!!, Error:${error}`)
}
