const request = require('supertest');
const app = require('../index');

describe('Cases API', () => {
  describe('GET /api/cases', () => {
    it('should return all cases', async () => {
      const res = await request(app)
        .get('/api/cases')
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(5);
      expect(res.body[0]).toHaveProperty('room', 'OR1');
    });
  });

  describe('GET /api/cases/room/:roomId', () => {
    it('should return cases for OR1', async () => {
      const res = await request(app)
        .get('/api/cases/room/OR1')
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(3);
      expect(res.body.every(c => c.room === 'OR1')).toBeTruthy();
    });

    it('should return empty array for non-existent room', async () => {
      const res = await request(app)
        .get('/api/cases/room/OR99')
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/cases/surgeons/:id', () => {
    it('should return Dr. Smith details', async () => {
      const res = await request(app)
        .get('/api/cases/surgeons/1')
        .expect(200);

      expect(res.body).toMatchObject({
        id: '1',
        name: 'Smith',
        specialty: 'Orthopedic Surgery',
        subspecialty: 'Knee Specialist'
      });
    });

    it('should return 404 for non-existent surgeon', async () => {
      const res = await request(app)
        .get('/api/cases/surgeons/999')
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Surgeon not found');
    });
  });
}); 