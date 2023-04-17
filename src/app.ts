import express, { Application } from 'express'
import userRoute from './routes/userRoute'
import menuRoute from './routes/menuRoute'

export const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/', userRoute)
app.use('/api/', menuRoute)

app.use('*', (req, res) => {
    // development
    res.status(404).send(`use /api/`)
})
