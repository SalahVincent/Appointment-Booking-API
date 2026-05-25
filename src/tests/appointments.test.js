import request from 'supertest';
import { app } from '../app.js';
import sequelize from '../config/db.js';
import { User, Appointment, Service, TimeSlot } from '../models/index.js';
import { generateToken } from '../utils/authUtils.js';

describe('Appointment Dashboard & Control Tests', () => {
  let providerToken, clientToken, targetAppointment;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const provider = await User.create({ name: 'Doc', email: 'doc@test.com', password: '123', role: 'provider' });
    const client = await User.create({ name: 'Guy', email: 'guy@test.com', password: '123', role: 'client' });
    providerToken = generateToken(provider);
    clientToken = generateToken(client);

    const service = await Service.create({ name: 'Checkup', price: 40, duration: 30, providerId: provider.id });
    const slot = await TimeSlot.create({ date: '2026-08-12', startTime: '09:00:00', endTime: '09:30:00', providerId: provider.id, isBooked: true });

    targetAppointment = await Appointment.create({
      serviceId: service.id,
      clientId: client.id,
      slotId: slot.id,
      date: slot.date,
      status: 'pending'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('PATCH /api/appointments/:id/status', () => {
    it('SUCCESS: Should allow the provider to confirm a booking', async () => {
      const res = await request(app)
        .patch(`/api/appointments/${targetAppointment.id}/status`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ status: 'confirmed' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.appointment.status).toEqual('confirmed');
    });
  });
});