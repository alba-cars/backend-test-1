import { Blog } from "../../../domain/entities/Blog";
import BlogRepository from "../../../domain/repositories/BlogRepository";


export class UpdateBlogPost {
  constructor(private blogPostRepository: BlogRepository) {}

  async execute(id: string, blogPostData: Partial<Blog>): Promise<Blog> {
    const existingBlogPost = await this.blogPostRepository.findById(id);

    if (!existingBlogPost) {
      throw new Error("Blog post not found");
    }

    const updatedBlogPostData: Partial<Blog> = {
      ...existingBlogPost,
      ...blogPostData,
    };

    return await this.blogPostRepository.update(id, updatedBlogPostData);
  }
}
