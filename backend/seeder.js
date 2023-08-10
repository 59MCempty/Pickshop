import mongoose from 'mongoose'
import color from 'colors'
import 'dotenv/config.js'
import users from './data/user.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Order from './models/orderModel.js'
import Product from './models/productModel.js'
import connectDB from './config/db.js'


// mongoose always return promise
connectDB()


// import data
const importData = async () => {
    try {
        //  delete all model match with condition in (), if not pass in () --> delete all
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)
        console.log("Data Imported!".green.inverse)
        process.exit()
    } catch (err) {
        console.log(`${err}`.red.inverse)
        process.exit(1)
    }
}
const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (err) {
        console.log(`${err}`.red.inverse)
        process.exit(1)
    }
}


if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}





