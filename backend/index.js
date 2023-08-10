import path from 'path'
import express from 'express'
import 'dotenv/config.js'
import connectDB from './config/db.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import { errorHandler, notFound } from './middleware/errorHandler.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoute.js'


const app = express()


connectDB()

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.use('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_ID })
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    const __dirname = path.resolve()
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

}

app.use(errorHandler)
app.use(notFound)

const port = process.env.PORT || 3000


app.listen(port, () => {
    console.log(`${process.env.NODE_ENV}`, port)
})
