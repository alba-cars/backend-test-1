const request = require('supertest');
const app = require('../app');
const fs = require('fs-extra');
const path = require('path');

const BASE_HREF = "http://localhost:9001"

describe('API endpoints', () => {

    // Add blog post succeeded Test - POST /api/blog/create endpoint
    describe('POST /api/blog/create', () => {
        it('should add a valid blog post with all fields', async () => {
          const newPost = {
            title: 'My Blog Title1',
            description: 'Blog description',
            date_time: 1684003207,
          };
      
          const response = await request(BASE_HREF)
            .post('/api/blog/create')
            .field('Content-Type', 'multipart/form-data')
            .attach('main_image',  fs.createReadStream(path.join(__dirname, '0b0115bff84152bd38911257ad93ce02.jpg')))
            .attach('additional_images',  fs.createReadStream(path.join(__dirname, '0b0115bff84152bd38911257ad93ce02.jpg')))
            .field(newPost);
            expect(response.status).toBe(200);
           // expect(response.body.result).toMatchObject(newPost);
        });
      });

    // Add partial blog post fields - POST /api/blog/create endpoint
      describe('POST /api/blog/create', () => {
        it('should return an error message for missing required fields', async () => {
          const newPost = {
            title: 'My Blog Title1',
            date_time: 1684003207,
          };
      
          const response = await request(BASE_HREF)
          .post('/api/blog/create')
          .send(newPost);
          console.log(response);
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Invalid description. Description should be up to 500 characters.');
        });
      });

    // Test GET /api/blog/all endpoint
    describe('GET /api/blog/all', () => {
      it('should return a list of blogs', async () => {
        const response = await request(BASE_HREF).get('/api/blog/all');
        const result = response.body[0];
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(result).toHaveProperty('reference');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('main_image');
        expect(result).toHaveProperty('date_time');
      });
    });
  

  });