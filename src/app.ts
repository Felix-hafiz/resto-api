import express, { Application } from 'express'
import userRoute from './routes/userRoute'
import authRoute from './routes/authRoute'
import { errorHandler } from './utils/errorHandler'
import pinoHttp from 'pino-http'
import logger from './utils/logger'

export const app: Application = express()

app.use(
    pinoHttp({
        logger,
        autoLogging: process.env.NODE_ENV === 'test' ? false : true, // test is default env when running jest
    }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', authRoute)
app.use('/api/v1', userRoute)

app.use(errorHandler)

app.use('*', (req, res) => {
    // development
    res.status(404).send('Server Running!! routes:/api/v1')
})
