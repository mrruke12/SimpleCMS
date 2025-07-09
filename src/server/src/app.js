import express from 'express'
import mainRoute from './routes/main.route.js'
import usersRoute from './routes/users.routes.js'
import notFoundMiddleware from './middlewares/notfound.middleware.js'
import authRoute from './routes/auth.routes.js'
import projectsRoute from './routes/projects.routes.js'
import commitsRoute from './routes/commits.routes.js'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL
}))

app.use(express.json())
app.use('/', mainRoute)
app.use('/api/users', usersRoute)
app.use('/api/projects', projectsRoute)
app.use('/api/commits', commitsRoute)
app.use('/api/auth', authRoute)
app.use(notFoundMiddleware)



export default app