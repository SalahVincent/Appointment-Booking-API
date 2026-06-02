import { httpServer } from './app.js';
import sequelize from './config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
  await sequelize.authenticate()
  console.log('✅ Connection to PostgreSQL established.')

  await sequelize.sync({ alter: true })
  console.log('✅ Database models synced.')

  httpServer.listen(PORT, () => {
    console.log(`Server and WebSockets ready at http://localhost:${PORT}`)
  })
} catch (error) {
  console.error('❌ Database connection failed:', error)
  process.exit(1)
}
}

startServer();