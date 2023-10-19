import * as dotenv from 'dotenv'
dotenv.config()

import { app } from './app'

import './utils/db'
import logger from './utils/logger'

app.listen(process.env.PORT, () => {
    logger.info('running')
})
