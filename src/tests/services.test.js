import request from 'supertest';
import { app } from '../app.js';
import sequelize from '../config/db.js';
import { User } from '../models/index.js';
import { generateToken } from '../utils/authUtils.js';

describe('Services Lifecycle Tests', () => {
  let providerToken, clientToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const provider = await User.create({ name: 'P1', email: 'p1@test.com', password: '123', role: 'provider' });
    const client = await User.create({ name: 'C1', email: 'c1@test.com', password: '123', role: 'client' });

    providerToken = generateToken(provider);
    clientToken = generateToken(client);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/services', () => {
    it('FAILURE: Should block standard clients from creating services', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ name: 'Haircut', price: 25, duration: 30 });

      expect(res.statusCode).toEqual(403);
    });

    it('SUCCESS: Should allow provider profiles to create services', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ name: 'Therapy Session', description: 'Mental health check', price: 80, duration: 50 });

      expect(res.statusCode).toEqual(201);
    });
  });
});