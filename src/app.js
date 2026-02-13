import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db.js'
import './models/user.js'
import authRoutes from './routes/authRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/appointments', appointmentRoutes)

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000

try {
  await sequelize.authenticate()
  console.log('✅ Connection to PostgreSQL established.')

  await sequelize.sync({ alter: true })
  console.log('✅ Database models synced.')

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
  })
} catch (error) {
  console.error('❌ Database connection failed:', error)
  process.exit(1)
}