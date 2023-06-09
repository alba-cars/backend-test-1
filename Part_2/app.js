var express= require('express');
var app =express();
const multer = require('multer');


var path = require('path');

app.use(express.json());


require('./app/routes/blogs.routes')(app)
require('./app/routes/token.routes')(app)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 1MB.' });
      }
    }
    if (err.message === 'Only JPG images are allowed') {
      return res.status(400).json({ error: 'Only JPG images are allowed.' });
    }
    return next(err);
  });

app.listen(9001)
console.log('Sever is listening 9001');