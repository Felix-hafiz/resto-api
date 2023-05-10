import { MongoMemoryServer } from 'mongodb-memory-server'
import config from './config'

export default async function globalTeardown() {
    if (config.Memory) {
        /* eslint @typescript-eslint/no-explicit-any: ["off"] */
        const mongod: MongoMemoryServer = (global as any).__MONGOINSTANCE
        await mongod.stop()
    }
}
