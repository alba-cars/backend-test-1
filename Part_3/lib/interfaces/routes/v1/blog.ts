import express from 'express';
import { BlogPostController } from '../../controllers/BlogPostController';
import { upload } from '../../../infrastructure/webserver/multer-config';


const router = express.Router();
const blogPostController = new BlogPostController();

router.post('/', upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'additional_images', maxCount: 5 },
  ]), blogPostController.create);
router.get('/:id', blogPostController.getById);
router.get('/', blogPostController.getAll);
router.put('/:id', blogPostController.update);
router.delete('/:id', blogPostController.delete);

export default router;

