import 'dotenv/config'
import server from './src/server.js'
import connectDB from './src/db.js'


server.start(process.env.PORT)
await connectDB()