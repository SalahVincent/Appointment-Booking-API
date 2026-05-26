import express from 'express'
import dotenv from 'dotenv'
import './models/user.js'
import authRoutes from './routes/authRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import { initSocket } from './sockets/socketHandler.js'
import http from 'http'
import slotRoutes from './routes/slotRoutes.js'

dotenv.config()

const app = express()
const httpServer = http.createServer(app)
initSocket(httpServer)

app.use(express.json())

app.use('/api/slots', slotRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/appointments', appointmentRoutes)

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// const PORT = process.env.PORT || 3000;

// try {
//   await sequelize.authenticate()
//   console.log('✅ Connection to PostgreSQL established.')

//   await sequelize.sync({ alter: true })
//   console.log('✅ Database models synced.')

//   httpServer.listen(PORT, () => {
//     console.log(`Server and WebSockets ready at http://localhost:${PORT}`)
//   })
// } catch (error) {
//   console.error('❌ Database connection failed:', error)
//   process.exit(1)
// }

export { app, httpServer }