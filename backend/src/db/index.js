import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB CONNECTED !! DB HOST : ${conn.connection.host}`)

    } catch (error) {
        console.log("MONGODB_CONNECTION ERROR: ", error)
        process.exit(1)
    }
}

export default ConnectDB