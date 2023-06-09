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
            .attach('main_image',  fs.createReadStream(path.join(__dirname, 'mainImage.jpg')))
            .attach('additional_images',  fs.createReadStream(path.join(__dirname, 'additionalImage.jpg')))
            .field(newPost);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(newPost);
        });
      });

    // Add partial blog post fields - POST /api/blog/create endpoint
      describe('POST /api/blog/create', () => {
        it('should return an error message for missing required fields', async () => {
          const newPost = {
            title: 'My Blog Title2',
            date_time: 1684003207,
          };
      
          const response = await request(BASE_HREF)
          .post('/api/blog/create')
          .send(newPost);
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Invalid description. Description should be up to 500 characters.');
        });
      });

    // Add full blog post fields with title that has special characters
    describe('POST /api/blog/create', () => {
      it('should return an error message that title that has special characters', async () => {
        const newPost = {
          title: 'My Blog--&, Title4',
          description: 'Blog description',
          date_time: 1684003207,
        };
    
        const response = await request(BASE_HREF)
          .post('/api/blog/create')
          .field('Content-Type', 'multipart/form-data')
          .attach('main_image',  fs.createReadStream(path.join(__dirname, 'mainImage.jpg')))
          .attach('additional_images',  fs.createReadStream(path.join(__dirname, 'additionalImage.jpg')))
          .field(newPost);
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Invalid title. Title should be between 5 and 50 characters, containing only letters, numbers, and spaces.');
      });
    });

    // Add full blog post fields with main_image that exceeds 1MB
    describe('POST /api/blog/create', () => {
      it('should return an error message for file size exceed 1MB', async () => {
        const newPost = {
          title: 'My Blog Title3',
          description: 'Blog description',
          date_time: 1684003207,
        };
    
        const response = await request(BASE_HREF)
          .post('/api/blog/create')
          .field('Content-Type', 'multipart/form-data')
          .attach('main_image',  fs.createReadStream(path.join(__dirname, 'bigSizedImage.jpg')))
          .attach('additional_images',  fs.createReadStream(path.join(__dirname, 'additionalImage.jpg')))
          .field(newPost);
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('File too large. Maximum size is 1MB.');
      });
    });

    // Add full blog post fields with ISO date_time
      describe('POST /api/blog/create', () => {
      it('should return an error message that date time is invalid', async () => {
        const newPost = {
          title: 'My Blog Title5',
          description: 'Blog description',
          date_time: "2023-05-13T18:40:07.000Z",
        };
    
        const response = await request(BASE_HREF)
          .post('/api/blog/create')
          .field('Content-Type', 'multipart/form-data')
          .attach('main_image',  fs.createReadStream(path.join(__dirname, 'mainImage.jpg')))
          .attach('additional_images',  fs.createReadStream(path.join(__dirname, 'additionalImage.jpg')))
          .field(newPost);
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Date time is not unix time or missing date_time');
      });
    });
  
    //Add blog post then Get all blog posts successful Test
    describe('GET /api/blog/all', () => {
      it('should return a list of blogs that includes the added blog post', async () => {
        const newPost = {
          title: 'My Blog Title7',
          description: 'Blog description',
          date_time: 1684003207,
        };
    
        await request(BASE_HREF)
          .post('/api/blog/create')
          .field('Content-Type', 'multipart/form-data')
          .attach('main_image',  fs.createReadStream(path.join(__dirname, 'mainImage.jpg')))
          .attach('additional_images',  fs.createReadStream(path.join(__dirname, 'additionalImage.jpg')))
          .field(newPost);

        const response = await request(BASE_HREF).get('/api/blog/all');
        const result = response.body;
        const addedPost = result.find(post => post.title === 'My Blog Title7');
    
        expect(response.status).toBe(200);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    //Add blog post then Get all blog posts failed Test
    describe('GET /api/blog/all', () => {
      it('Add an invalid blog post then Get all blog posts and check if the added blog post was not addedinvalid blog post so post not added', async () => {
        const newPost = {
          title: 'My Blog Title60',
          description: 'Blog description'
        };
    
        await request(BASE_HREF)
          .post('/api/blog/create')
          .field('Content-Type', 'multipart/form-data')
          .attach('main_image',  fs.createReadStream(path.join(__dirname, 'mainImage.jpg')))
          .attach('additional_images',  fs.createReadStream(path.join(__dirname, 'additionalImage.jpg')))
          .field(newPost);

        const response = await request(BASE_HREF).get('/api/blog/all');
        const result = response.body;
        const addedPost = result.find(post => post.title === 'My Blog Title60');
    
        expect(response.status).toBe(200);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  
    // Get token from Generate token API and send to Get image by token API successful Test
    describe('POST /api/token/image', () => {
      it('should return token for image path', async () => {
        const newPost = {
          image_path: 'images/0b0115bff84152bd38911257ad93ce02.jpg'
        };
    
        const response = await request(BASE_HREF)
          .post('/api/token/generate')
          .send(newPost);
        
        const token = response.body.token;
        const getImage = {
          image_path: 'images/0b0115bff84152bd38911257ad93ce02.jpg',
          token: token,
        };

        const responseImage = await request(BASE_HREF)
          .post('/api/token/image')
          .send(getImage);
          
        expect(responseImage.status).toBe(200);
      });
    });
    
  
    //Get token from Generate token API and send to Get image by token API failed Test
    describe('GET /api/token/image', () => {
      it('should return token for image path', async () => {
        const newPost = {
          image_path: 'images/0b0115bff84152bd38911257ad93ce02.jpg'
        };
    
        const response = await request(BASE_HREF)
          .post('/api/token/generate')
          .send(newPost);
        
        const token = response.body.token;
        const getImage = {
          image_path: 'images/e6363e6339119dced538ecdcfc605b63.jpg',
          token: token,
        };

        const responseImage = await request(BASE_HREF)
          .post('/api/token/image')
          .send(getImage);
          
            expect(responseImage.status).toBe(401);
          expect(responseImage.body.error).toBe('Invalid Image Path');

      });
    });


  });