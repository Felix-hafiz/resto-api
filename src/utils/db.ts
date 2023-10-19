import mongoose from 'mongoose'
import logger from './logger'
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false,
            dbName: process.env.MONGODB_DB_NAME,
        })
        logger.info('db connected')
    } catch (error) {
        mongoose.disconnect()
        logger.error('mongodb unConnected!!!')
        process.exit(0)
    }
})()
