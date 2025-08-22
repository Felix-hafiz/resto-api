import express, { Application } from 'express'
import userRoute from './routes/userRoute'
import authRoute from './routes/authRoute'
import { errorHandler } from './utils/errorHandler'
import pinoHttp from 'pino-http'
import logger from './utils/logger'
import menuRoute from './routes/menuRoute'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import orderRoute from './routes/orderRoute'
import cors from 'cors'

export const app: Application = express()

app.use(cors())
app.options('*', cors())

app.use(
    pinoHttp({
        logger,
        autoLogging: process.env.NODE_ENV === 'test' ? false : true, // test is default env when running jest
    }),
)

app.use(helmet())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', authRoute)
app.use('/api/v1', userRoute)
app.use('/api/v1', menuRoute)
app.use('/api/v1', orderRoute)

app.use(errorHandler)

app.use('*', (req, res) => {
    // development
    res.status(404).send('Server Running!! routes:/api/v1')
})
