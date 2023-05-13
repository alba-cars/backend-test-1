import {Blog} from "../../../domain/entities/Blog";
import BlogRepository from "../../../domain/repositories/BlogRepository";
import { BlogModel } from "../../orm/mongoose/schemas/Blog";


export class BlogPostMongooseRepository implements BlogRepository {
  async create(blogPost: Blog): Promise<Blog> {
    const createdBlogPost = await BlogModel.create(blogPost);
    return new Blog(createdBlogPost.toObject());
  }

  async findById(id: string): Promise<Blog | null> {
    const foundBlogPost = await BlogModel.findById(id);
    return foundBlogPost ? new Blog(foundBlogPost.toObject()) : null;
  }

  async findAll(): Promise<Blog[]> {
    const blogPosts = await BlogModel.find();
    return blogPosts.map((blogPost) => new Blog(blogPost.toObject()));
  }

  async update(id: string, blogPost: Partial<Blog>): Promise<Blog> {
    const updatedBlogPost = await BlogModel.updateOne({_id:id}, blogPost);

    console.log(updatedBlogPost);
    
    
    if (!updatedBlogPost) {
      throw new Error('Blog post not found');
    }

    const updatedBlog = await BlogModel.findOne({_id:id})

    if (!updatedBlog) {
        throw new Error('Blog post not found');
      }

    return new Blog(updatedBlog);
  }
  

  async delete(id: string): Promise<void> {
    await BlogModel.findByIdAndDelete(id);
  }

  async findLatest(): Promise<Blog | null> {
    const latestBlogPost = await BlogModel.findOne().sort({ _id: -1 }).exec();
    return latestBlogPost ? new Blog(latestBlogPost.toObject()) : null;
  }
  
}
