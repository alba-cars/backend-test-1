import express from 'express';
import fs from 'fs';
import serviceLocator from '../../infrastructure/config/service-locator';

import { CreateBlogPost } from '../../application/use_cases/blogPost/CreateBlogPost';
import { GetBlogPostById } from '../../application/use_cases/blogPost/GetBlogPostById';
import { GetAllBlogPosts } from '../../application/use_cases/blogPost/GetAllBlogPosts';
import { UpdateBlogPost } from '../../application/use_cases/blogPost/UpdateBlogPost';
import { DeleteBlogPost } from '../../application/use_cases/blogPost/DeleteBlogPost';
import BlogRepository from '../../domain/repositories/BlogRepository';
import { Blog } from '../../domain/entities/Blog';

export class BlogPostController {
  private blogPostRepository: BlogRepository;

  constructor() {
    this.blogPostRepository = serviceLocator.get<BlogRepository>('blogRepository');
  }

  create = async (req: any, res: any) => {
    try {

      const additionalImages = req.files['additional_images'] ? req.files['additional_images'].map((file: any) => file.path) : [];

      const blogPostData = {
        ...req.body,
        main_image: req.files['main_image'][0].path,
        additional_images: additionalImages,
      };

      const userId = req.userId;
      const createBlogPost = new CreateBlogPost(this.blogPostRepository);
      const result = await createBlogPost.execute(blogPostData,userId);
      res.status(201).json(result);
      
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req: express.Request, res: express.Response) => {
    try {
      const getBlogPostById = new GetBlogPostById(this.blogPostRepository);
      const blogPost = await getBlogPostById.execute(req.params.id);
      if (blogPost) {
        res.status(200).json(blogPost);
      } else {
        res.status(404).json({ message: 'Blog post not found' });
      }
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };

  getAll = async (_: express.Request, res: express.Response) => {
    try {
      const getAllBlogPosts = new GetAllBlogPosts(this.blogPostRepository);
      const blogPosts = await getAllBlogPosts.execute();
      res.status(200).json(blogPosts);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };

  update = async (req: any, res: express.Response) => {
    try {
      const { id } = req.params;
      const existingBlogPost = await this.blogPostRepository.findById(id);
  
      if (!existingBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      const mainImage = req.files && req.files['main_image']
        ? req.files['main_image'][0].path
        : existingBlogPost.main_image;
  
      const additionalImages = req.files && req.files['additional_images']
        ? req.files['additional_images'].map((file: any) => file.path)
        : existingBlogPost.additional_images;
  
      const blogPostData: Partial<Blog> = {
        ...req.body,
        main_image: mainImage,
        additional_images: additionalImages,
      };
  
      const updateBlogPost = new UpdateBlogPost(this.blogPostRepository);
      const updatedBlogPost = await updateBlogPost.execute(id, blogPostData);
  
      // Delete old images if new images are provided
      if (req.files && req.files['main_image']) {
        fs.unlinkSync(existingBlogPost.main_image);
      }
  
      if (req.files && req.files['additional_images']) {
        existingBlogPost.additional_images.forEach((filePath: string) => {
          fs.unlinkSync(filePath);
        });
      }
  
      res.status(200).json(updatedBlogPost);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };

  delete = async (req: express.Request, res: express.Response) => {
    try {
      const deleteBlogPost = new DeleteBlogPost(this.blogPostRepository);
      await deleteBlogPost.execute(req.params.id);
      res.status(204).json({ message: 'Blog post deleted' });
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };
}

