import mongoose from 'mongoose'
import 'dotenv/config.js'


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connecting to ${conn.connection.host}`)
    }
    catch (err) {
        console.log(`Error: ${err.message}`)
        process.exit(1)
    }
}


export default connectDB;
