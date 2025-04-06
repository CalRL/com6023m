import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Express with postgres');
    });
});