const request = require('supertest');
const express = require('express');
const staffRouter = require('../routes/staff');
const { testStaffMembers, testAllStaffMembers } = require('./setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/staff', staffRouter);

describe('Staff API', () => {
  describe('GET /api/staff/names', () => {
    it('should return all staff members with shift status', async () => {
      const res = await request(app)
        .get('/api/staff/names')
        .query({ date: '2024-02-20' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('hasShift');
    });
  });

  describe('GET /api/staff', () => {
    it('should return staff members with shifts for given date', async () => {
      const res = await request(app)
        .get('/api/staff')
        .query({ date: '2024-02-20' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.every(staff => staff.shift)).toBeTruthy();
    });

    it('should not return duplicate staff members for the same date', async () => {
      // First create a duplicate shift
      await request(app)
        .post('/api/staff')
        .send({
          id: '1',
          name: 'Test Nurse',
          role: 'RN',
          start: '2024-02-20T15:30:00',
          end: '2024-02-20T23:00:00'
        });

      const res = await request(app)
        .get('/api/staff')
        .query({ date: '2024-02-20' });

      // Count occurrences of each staff ID
      const staffCounts = res.body.reduce((counts, staff) => {
        counts[staff.id] = (counts[staff.id] || 0) + 1;
        return counts;
      }, {});

      // Verify no staff member appears more than once
      expect(Object.values(staffCounts).every(count => count === 1)).toBeTruthy();
    });
  });

  describe('POST /api/staff', () => {
    it('should create a new shift for existing staff', async () => {
      const newShift = {
        id: '2',
        name: 'Available Nurse',
        role: 'RN',
        start: '2024-02-21T07:00:00',
        end: '2024-02-21T15:30:00'
      };

      const res = await request(app)
        .post('/api/staff')
        .send(newShift);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(newShift.name);
      expect(res.body.shift).toBeDefined();
    });

    it('should prevent duplicate shifts for same date', async () => {
      const duplicateShift = {
        id: '1',
        name: 'Test Nurse',
        role: 'RN',
        start: '2024-02-20T07:00:00',
        end: '2024-02-20T15:30:00'
      };

      const res = await request(app)
        .post('/api/staff')
        .send(duplicateShift);

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should create new staff member if not exists', async () => {
      const newStaffShift = {
        id: '3',
        name: 'New Nurse',
        role: 'RN',
        start: '2024-02-20T07:00:00',
        end: '2024-02-20T15:30:00'
      };

      const res = await request(app)
        .post('/api/staff')
        .send(newStaffShift);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(newStaffShift.name);
      expect(res.body.shift).toBeDefined();
    });
  });

  describe('DELETE /api/staff/:id/shift', () => {
    it('should delete shift and update status', async () => {
      const res = await request(app)
        .delete('/api/staff/1/shift');

      expect(res.status).toBe(200);
      expect(res.body.shift).toBeUndefined();
      expect(res.body.status).toBe('unavailable');
    });

    it('should return 404 for non-existent staff', async () => {
      const res = await request(app)
        .delete('/api/staff/999/shift');

      expect(res.status).toBe(404);
    });

    it('should completely remove staff from shifts list', async () => {
      // First delete the shift
      await request(app).delete('/api/staff/4/shift');  // Tom Davis's ID

      // Then verify they don't appear in the staff list for that date
      const res = await request(app)
        .get('/api/staff')
        .query({ date: '2024-02-20' });

      const tomDavis = res.body.find(s => s.name === 'Tom Davis');
      expect(tomDavis).toBeUndefined();
    });
  });
}); 