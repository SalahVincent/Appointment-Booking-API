import request from 'supertest';
import { app } from '../app.js'
import sequelize from '../config/db.js';
import { User } from '../models/index.js';

describe('Auth Endpoint Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('SUCCESS: Should register a new client user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Vincent Salah',
          email: 'vincent@example.com',
          password: 'password123',
          role: 'client'
        });

      expect(res.statusCode).toEqual(201);
    });
  });

  describe('POST /api/auth/login', () => {
    it('SUCCESS: Should return a JWT token on valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'vincent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});