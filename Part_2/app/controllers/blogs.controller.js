const { Console } = require('console');
const fs = require('fs-extra');
const multer = require('multer');
const sharp = require('sharp');
const blogsFilePath = './blogs.json';

function validateInputs(title, description,date_time) {
    if (!title || typeof title !== 'string' || title.length < 5 || title.length > 50 || /[^a-zA-Z0-9\s]/.test(title)) {
      return 'Invalid title. Title should be between 5 and 50 characters, containing only letters, numbers, and spaces.';
    }
  
    if (!description || typeof description !== 'string' || description.length > 500) {
      return 'Invalid description. Description should be up to 500 characters.';
    }
  
  const unixTimestamp = Math.floor(new Date().getTime() / 1000);
    if (!date_time || isNaN(date_time) || date_time < unixTimestamp) {
      return 'Invalid or missing date_time';
    }
  
    return null;
  }
  
  function generateNextNumber(currentNumber) {
      const nextNumber = String(Number(currentNumber) + 1).padStart(currentNumber.length, '0');
      return nextNumber;
    }
  
  function getNextReferenceNumber() {
    let blogs = [];
    if (fs.existsSync(blogsFilePath)) {
    try {
      const blogsData = fs.readFileSync(blogsFilePath, 'utf8');
      blogs = JSON.parse(blogsData);
    } catch (error) {
      console.log("nodata");
    }
    }
  
    const lastBlog = blogs[blogs.length - 1];
    const reference_last = lastBlog ? lastBlog.reference : "00000";
    const reference = generateNextNumber(reference_last);
    return reference;
  }
  
  function saveBlogPost(blogPost) {
    let blogs = [];
    if (fs.existsSync(blogsFilePath)) {
     try {
      const blogsData = fs.readFileSync(blogsFilePath, 'utf8');
      blogs = JSON.parse(blogsData);
     } catch (error) {
      console.log("nodata");
     }
    }
  
    blogs.push(blogPost);
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
  }
  
  const compressAndSaveImage = async (sourcePath, destinationPath) => {
      await sharp(sourcePath)
        .jpeg({ quality: 75 })
        .toFile(destinationPath);
      fs.unlinkSync(sourcePath); 
    };
  
  function slugify(title) {
      return title.toLowerCase().replace(/ /g, '_');
  }

exports.create = async (req, res) => {
    const { title, description,date_time  } = req.body;

 
    const validationError = validateInputs(title, description,date_time);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    console.log(req);
    if (!req.files["main_image"]) {
        return res.status(400).json({ error: 'Main image (jpg) is required' });
    }
    let mainImage;
    const additionalImages = [];
    
for (const file of Object.keys(req.files)) {
const imagetype = file;
const files = req.files[imagetype];
files.forEach(async (file) => {
    const ImagePath = `./images/${file.filename}.jpg`;
    if(imagetype=="additional_images"){
        additionalImages.push(ImagePath);
    }
    if(imagetype=="main_image"){
        mainImage=ImagePath;
    }
    const compressimg= await compressAndSaveImage(file.path, ImagePath);
    console.log(compressimg) 
   
    });
}


    const reference = getNextReferenceNumber();
  

    const blogPost = {
      reference,
      title,
      description,
      main_image: mainImage,
      additional_images: additionalImages,
      "date_time": parseInt(date_time),
    };
  

    saveBlogPost(blogPost);
 
   return res.json(blogPost);

  //   return res.json({
  //     status: 200,
  //     result: blogPost,
  //     message:"Blog post created successfully"
  // });

}

exports.all = async (req, res) => {
 
        try {
            const blogsData = fs.readFileSync(blogsFilePath, 'utf8');
            blogs = JSON.parse(blogsData);  
            formattedBlogPosts = blogs.map((post) => {
                const date = new Date(Number(post.date_time) * 1000);
                const isoDate = date.toISOString();
                const titleSlug = slugify(post.title);
              
                return {
                  ...post,
                  date_time: isoDate,
                  title_slug: titleSlug
                };
              });
        } catch (error) {
            res.status(400).json({ error: 'no blogs available' }); 
        }
        
    return res.json(formattedBlogPosts);
}


