import { Blog } from "../../../domain/entities/Blog";
import BlogRepository from "../../../domain/repositories/BlogRepository";


export class GetBlogPostById {
  constructor(private blogPostRepository: BlogRepository) {}

  async execute(id: string): Promise<Blog | null> {
    return await this.blogPostRepository.findById(id);
  }
}
