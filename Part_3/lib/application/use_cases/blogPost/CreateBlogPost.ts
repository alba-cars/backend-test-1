import {Blog} from "../../../domain/entities/Blog";
import BlogRepository from "../../../domain/repositories/BlogRepository";
import { BlogValidationSchema } from "../../../domain/validators/BlogValidator";
import UserBlogPost from "../../../infrastructure/orm/mongoose/schemas/UserBlogPost";


export class CreateBlogPost {
  constructor(private blogPostRepository: BlogRepository) {}

  private async generateReference(): Promise<string> {
    const latestBlogPost = await this.blogPostRepository.findLatest();

    let nextReferenceNumber = 1;
    if (latestBlogPost) {
      const currentReferenceNumber = parseInt(latestBlogPost.reference|| "00000", 10);
      nextReferenceNumber = currentReferenceNumber + 1;
    }

    const reference = String(nextReferenceNumber).padStart(5, '0');
    return reference;
  }

  async execute(blogPostData: Partial<Blog>, userId: string): Promise<Blog> {
    // Validate the blogPostData using Joi schema
    await BlogValidationSchema.validateAsync(blogPostData);

    const reference = await this.generateReference();
    const blogPost = new Blog({ ...blogPostData, reference });

    const createdBlogPost = await this.blogPostRepository.create(blogPost)

    await UserBlogPost.create({
      user_id: userId,
      blog_post_id: createdBlogPost.reference,
    });

    return createdBlogPost;
  }
}
