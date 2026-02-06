import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db.js'
import './models/user.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000

try {
  await sequelize.authenticate()
  console.log('✅ Connection to PostgreSQL established.')

  await sequelize.sync({ alter: true })
  console.log('✅ Database models synced.')

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
} catch (error) {
  console.error('❌ Database connection failed:', error)
  process.exit(1)
}