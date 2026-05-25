import request from 'supertest'
import { app } from '../app.js'
import sequelize from '../config/db.js'
import { User, TimeSlot, Service } from '../models/index.js'
import { generateToken } from '../utils/authUtils.js'

describe('Time Slot & Appointment Integration Tests', () => {
  let clientToken, providerToken, testService, validSlot

  beforeAll(async () => {
    await sequelize.sync({ force: true })

    const provider = await User.create({
      name: 'Test Provider',
      email: 'provider@test.com',
      password: 'password123',
      role: 'provider'
    })

    const client = await User.create({
      name: 'Test Client',
      email: 'client@test.com',
      password: 'password123',
      role: 'client'
    })

    providerToken = generateToken(provider)
    clientToken = generateToken(client)

    testService = await Service.create({
      name: 'Consultation',
      description: 'Standard consulting session',
      price: 50,
      duration: 60,
      providerId: provider.id
    })

    validSlot = await TimeSlot.create({
      date: '2026-07-20',
      startTime: '10:00:00',
      endTime: '11:00:00',
      providerId: provider.id,
      isBooked: false
    })
  })

  afterAll(async () => {
    await sequelize.close();
  })

  describe('POST /api/appointments', () => {
    
    it('RULE 1: Should reject booking if the slotId does not exist', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          slotId: 9999,
          serviceId: testService.id
        })

      expect(res.statusCode).toEqual(404)
      expect(res.body.message).toMatch(/not found/i)
    })

    it('SUCCESS: Should successfully book an available slot', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          slotId: validSlot.id,
          serviceId: testService.id
        })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('status', 'pending')

      const updatedSlot = await TimeSlot.findByPk(validSlot.id)
      expect(updatedSlot.isBooked).toBe(true)
    })

    it('RULE 2: Should reject booking if the slot is already booked (Double-Booking)', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          slotId: validSlot.id,
          serviceId: testService.id
        })

      expect(res.statusCode).toEqual(409)
      expect(res.body.message).toMatch(/already booked/i)
    })
  })
})