const multer = require('multer');
module.exports = app =>{

    const router = require("express").Router()

    const blogs = require('../controllers/blogs.controller'); 

    const upload = multer({
        dest: 'images/', 
        limits: {
          fileSize: 1024 * 1024,
          files: 5, 
        },
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
            return cb(new Error('Only JPG images are allowed'));
          }
          cb(null, true);
        },
      });
      
    const uploadFields = [ { name: 'additional_images', maxCount: 5 }, { name: 'main_image', maxCount: 1 }, ];
    router.post("/create",upload.fields(uploadFields),  blogs.create);
    router.get("/all",  blogs.all);


    app.use("/api/blog",router)


} 