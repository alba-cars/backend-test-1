const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs-extra');

const secretKey = '123456'; 

exports.generate = async (req, res) => {
    const { image_path } = req.body;

    const token = jwt.sign({ image_path:image_path }, secretKey, { expiresIn: '5m' });
    res.json({ token });
}


exports.image = async (req, res) => {
    const { image_path, token } = req.body;
   
    try {
      const decoded = jwt.verify(token, secretKey);
console.log(decoded);
      if (decoded.image_path !== image_path) {
        return res.status(401).json({ error: 'Invalid Image Path' }); 
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  
try {
    const imagePath = path.join(process.cwd(), image_path);
    if(fs.existsSync(imagePath)){
        res.sendFile(imagePath);
    }else{
        res.status(401).json({ error: 'Invalid Image Path' });  
    }
   
} catch (error) {
    res.status(401).json({ error: 'Invalid Image Path' });   
}
    
   
}