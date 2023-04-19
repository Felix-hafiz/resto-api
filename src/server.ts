import * as dotenv from 'dotenv'
dotenv.config()

import { app } from './app'

import './utils/db'

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.info('running')
})
