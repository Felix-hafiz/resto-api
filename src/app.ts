import express, { Application } from 'express'
import userRoute from './routes/userRoute'
import menuRoute from './routes/menuRoute'
import authRoute from './routes/authRoute'
import { errorHandler } from './utils/errorHandler'
import pinoHttp from 'pino-http'
import logger from './utils/logger'

export const app: Application = express()

app.use(
    pinoHttp({
        logger,
    }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', authRoute)
app.use('/api/', menuRoute)
app.use('/api/v1', userRoute)

app.use(errorHandler)

app.use('*', (req, res) => {
    // development
    res.status(404).send('Server Running!! routes:/api/v1')
})
