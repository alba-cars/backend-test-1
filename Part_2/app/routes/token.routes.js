module.exports = app =>{

    const router = require("express").Router()

    const token = require('../controllers/token.controller'); 

    router.post("/generate",  token.generate);
    router.post("/image",  token.image);
 

    app.use("/api/token",router)


} 