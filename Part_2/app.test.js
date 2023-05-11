const request = require('supertest');
const app = require('./app');


const BASE_HREF = "http://localhost:9001"
describe('GET /api/blog/all', () => {
    it('should return all blogs', async () => {
        let response = await request(BASE_HREF)
            .get('/api/blog/all')
            .expect(200);
        expect(response.body); 
    });
});