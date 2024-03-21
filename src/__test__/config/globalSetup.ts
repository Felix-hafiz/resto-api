import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import config from './config'
import * as testUtils from './testUtils'

export default async function globalSetup() {
    if (config.Memory) {
        const mongod: MongoMemoryServer = await MongoMemoryServer.create()
        const uri = mongod.getUri()

        /* eslint @typescript-eslint/no-explicit-any: ["off"] */
        ;(global as any).__MONGOINSTANCE = mongod
        process.env.MONGODB_URI = uri.slice(0, uri.lastIndexOf('/'))
    } else {
        process.env.MONGODB_URI = `mongodb://${config.IP}:${config.Port}`
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/${config.Database}`)
    await mongoose.connection.dropDatabase()
    await testUtils.addAdminAccount()
    await mongoose.disconnect()
}
